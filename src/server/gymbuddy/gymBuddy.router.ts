/**
 * Gym Buddy Router
 * 
 * Routes incoming messages to appropriate handlers.
 */

import { orchestrate } from '../orchestrator/orchestrator.service'
import { Channel, Intent } from '../orchestrator/orchestrator.types'
import { gymBuddyService } from './gymBuddy.service'
import {
  getOnboardingQuestion,
  getNextOnboardingStep,
  validateOnboardingAnswer,
  parseOnboardingAnswer,
} from './gymBuddy.onboarding'
import {
  BuddyProfile,
  BuddyResponse,
  OnboardingStep,
} from './gymBuddy.types'

export class GymBuddyRouter {
  async handleMessage(
    userId: string,
    content: string,
    channel: 'whatsapp' | 'sms' | 'web'
  ): Promise<BuddyResponse> {
    await gymBuddyService.updateLastActive(userId)

    await gymBuddyService.saveMessage({
      userId,
      direction: 'inbound',
      content,
      channel,
    })

    const profile = await gymBuddyService.getProfile(userId)

    if (!profile) {
      return this.handleOnboarding(userId, content, OnboardingStep.WELCOME)
    }

    if (!profile.onboardingCompleted) {
      return this.handleOnboarding(userId, content, profile.onboardingStep)
    }

    return this.handleConversation(userId, content, channel, profile)
  }

  private async handleOnboarding(
    userId: string,
    content: string,
    currentStep: OnboardingStep
  ): Promise<BuddyResponse> {
    const question = getOnboardingQuestion(currentStep)

    if (currentStep === OnboardingStep.WELCOME) {
      const profile = await gymBuddyService.startOnboarding(userId, 'unknown')
      await gymBuddyService.updateOnboardingStep(userId, OnboardingStep.NAME)
      
      return {
        content: question.question,
        personalityStyle: profile.personalityStyle,
      }
    }

    const isValid = validateOnboardingAnswer(currentStep, content)
    if (!isValid) {
      return {
        content: `Hmm, das habe ich nicht ganz verstanden. ${question.question}`,
        personalityStyle: (await gymBuddyService.getProfile(userId))?.personalityStyle || 'motivator' as any,
      }
    }

    const parsedAnswer = parseOnboardingAnswer(currentStep, content)

    const updates: any = {}
    switch (currentStep) {
      case OnboardingStep.NAME:
        updates.name = parsedAnswer
        break
      case OnboardingStep.GOAL:
        updates.fitnessGoal = parsedAnswer
        break
      case OnboardingStep.LEVEL:
        updates.fitnessLevel = parsedAnswer
        break
      case OnboardingStep.FREQUENCY:
        updates.workoutFrequency = parsedAnswer
        break
      case OnboardingStep.EQUIPMENT:
        updates.equipment = parsedAnswer
        break
      case OnboardingStep.PERSONALITY:
        updates.personalityStyle = parsedAnswer
        break
    }

    const nextStep = getNextOnboardingStep(currentStep, content)
    await gymBuddyService.updateOnboardingStep(userId, nextStep, updates)

    if (nextStep === OnboardingStep.COMPLETE) {
      await gymBuddyService.createConfig({ userId })
      await gymBuddyService.createState(userId)
    }

    const nextQuestion = getOnboardingQuestion(nextStep)
    const profile = await gymBuddyService.getProfile(userId)

    return {
      content: nextQuestion.question,
      personalityStyle: profile?.personalityStyle || 'motivator' as any,
    }
  }

  private async handleConversation(
    userId: string,
    content: string,
    channel: 'whatsapp' | 'sms' | 'web',
    profile: BuddyProfile
  ): Promise<BuddyResponse> {
    const result = await orchestrate({
      channel: channel === 'whatsapp' ? Channel.WHATSAPP : Channel.WEB,
      payload: {
        text: content,
        from: userId,
      },
      timestamp: new Date(),
      tenantId: userId, // Each user is their own tenant in B2C
    })

    const state = await gymBuddyService.getState(userId)
    if (state) {
      await gymBuddyService.updateState(userId, {
        conversationContext: {
          lastTopic: result.intent.intent,
          lastIntent: result.intent.intent,
        },
      })
    }

    let responseContent = result.response.content

    if (result.intent.intent === Intent.TRAINING_PLAN) {
      responseContent = this.addPersonalityToResponse(
        responseContent,
        profile.personalityStyle,
        'workout'
      )
    } else if (result.intent.intent === Intent.GENERAL_QUESTION) {
      responseContent = this.addPersonalityToResponse(
        responseContent,
        profile.personalityStyle,
        'general'
      )
    }

    await gymBuddyService.saveMessage({
      userId,
      direction: 'outbound',
      content: responseContent,
      channel,
      metadata: {
        intent: result.intent.intent,
        confidence: result.intent.confidence,
      },
    })

    return {
      content: responseContent,
      personalityStyle: profile.personalityStyle,
      intent: result.intent.intent,
    }
  }

  private addPersonalityToResponse(
    response: string,
    personalityStyle: any,
    _context: 'workout' | 'general'
  ): string {
    const personalityAdditions: Record<string, string> = {
      motivator: ' 💪',
      friend: ' 😊',
      coach: ' 🎯',
      mentor: ' 🌱',
      cheerleader: ' 🎉',
      drill_sergeant: ' ⚡',
      scientist: ' 📊',
      comedian: ' 😄',
      zen_master: ' 🧘',
      competitor: ' 🏆',
    }

    const addition = personalityAdditions[personalityStyle] || ''
    return response + addition
  }

  async handlePushNotification(
    userId: string,
    trigger: string,
    content: string
  ): Promise<void> {
    await gymBuddyService.saveMessage({
      userId,
      direction: 'outbound',
      content,
      channel: 'whatsapp',
      metadata: {
        intent: 'push_notification',
      },
    })

    await gymBuddyService.updateLastActive(userId)
  }
}

export const gymBuddyRouter = new GymBuddyRouter()
