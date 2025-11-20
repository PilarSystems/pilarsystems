import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

interface LoadTestResults {
  totalWorkspaces: number
  totalUsers: number
  totalLeads: number
  totalMessages: number
  totalCalls: number
  errors: string[]
  duration: number
}

async function simulateWorkspaceCreation(index: number): Promise<string> {
  const workspaceId = `test-workspace-${index}-${Date.now()}`
  
  await prisma.workspace.create({
    data: {
      id: workspaceId,
      name: `Test Studio ${index}`,
      ownerId: `test-owner-${index}`,
      studioInfo: {
        name: `Test Studio ${index}`,
        size: '100-200',
        location: 'Test City'
      }
    }
  })

  return workspaceId
}

async function simulateUserSignup(workspaceId: string, index: number): Promise<string> {
  const userId = `test-user-${index}-${Date.now()}`
  
  await prisma.user.create({
    data: {
      id: userId,
      email: `test${index}@example.com`,
      workspaceId
    }
  })

  return userId
}

async function simulateLeadCreation(workspaceId: string, index: number): Promise<string> {
  const leadId = `test-lead-${index}-${Date.now()}`
  
  await prisma.lead.create({
    data: {
      id: leadId,
      workspaceId,
      name: `Test Lead ${index}`,
      email: `lead${index}@example.com`,
      phone: `+49${1000000000 + index}`,
      source: 'web',
      status: 'new',
      priority: 'medium'
    }
  })

  return leadId
}

async function simulateWhatsAppMessage(workspaceId: string, leadId: string, index: number): Promise<void> {
  await prisma.message.create({
    data: {
      workspaceId,
      leadId,
      channel: 'whatsapp',
      direction: 'inbound',
      content: `Test message ${index}`,
      aiGenerated: false
    }
  })
}

async function simulatePhoneCall(workspaceId: string, leadId: string, index: number): Promise<void> {
  await prisma.callLog.create({
    data: {
      workspaceId,
      leadId,
      phoneNumber: `+49${1000000000 + index}`,
      direction: 'inbound',
      status: 'answered',
      duration: Math.floor(Math.random() * 300) + 60
    }
  })
}

async function runLoadTest(numWorkspaces: number = 100): Promise<LoadTestResults> {
  const startTime = Date.now()
  const results: LoadTestResults = {
    totalWorkspaces: 0,
    totalUsers: 0,
    totalLeads: 0,
    totalMessages: 0,
    totalCalls: 0,
    errors: [],
    duration: 0
  }

  console.log(`Starting load test with ${numWorkspaces} workspaces...`)

  for (let i = 0; i < numWorkspaces; i++) {
    try {
      const workspaceId = await simulateWorkspaceCreation(i)
      results.totalWorkspaces++

      const userId = await simulateUserSignup(workspaceId, i)
      results.totalUsers++

      const numLeads = Math.floor(Math.random() * 5) + 1
      for (let j = 0; j < numLeads; j++) {
        const leadId = await simulateLeadCreation(workspaceId, i * 10 + j)
        results.totalLeads++

        const numMessages = Math.floor(Math.random() * 3) + 1
        for (let k = 0; k < numMessages; k++) {
          await simulateWhatsAppMessage(workspaceId, leadId, k)
          results.totalMessages++
        }

        if (Math.random() > 0.5) {
          await simulatePhoneCall(workspaceId, leadId, i * 10 + j)
          results.totalCalls++
        }
      }

      if (i % 10 === 0) {
        console.log(`Progress: ${i}/${numWorkspaces} workspaces created`)
      }
    } catch (error: any) {
      results.errors.push(`Workspace ${i}: ${error.message}`)
      console.error(`Error creating workspace ${i}:`, error.message)
    }
  }

  results.duration = Date.now() - startTime

  return results
}

async function cleanupTestData(): Promise<void> {
  console.log('Cleaning up test data...')
  
  await prisma.message.deleteMany({
    where: {
      workspace: {
        name: {
          startsWith: 'Test Studio'
        }
      }
    }
  })

  await prisma.callLog.deleteMany({
    where: {
      workspace: {
        name: {
          startsWith: 'Test Studio'
        }
      }
    }
  })

  await prisma.lead.deleteMany({
    where: {
      workspace: {
        name: {
          startsWith: 'Test Studio'
        }
      }
    }
  })

  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: 'test'
      }
    }
  })

  await prisma.workspace.deleteMany({
    where: {
      name: {
        startsWith: 'Test Studio'
      }
    }
  })

  console.log('Cleanup complete')
}

async function main() {
  const args = process.argv.slice(2)
  const numWorkspaces = args[0] ? parseInt(args[0]) : 100
  const cleanup = args.includes('--cleanup')

  if (cleanup) {
    await cleanupTestData()
    return
  }

  console.log('='.repeat(60))
  console.log('PILAR SYSTEMS - Load Testing Simulation')
  console.log('='.repeat(60))
  console.log()

  const results = await runLoadTest(numWorkspaces)

  console.log()
  console.log('='.repeat(60))
  console.log('Load Test Results')
  console.log('='.repeat(60))
  console.log(`Total Workspaces: ${results.totalWorkspaces}`)
  console.log(`Total Users: ${results.totalUsers}`)
  console.log(`Total Leads: ${results.totalLeads}`)
  console.log(`Total Messages: ${results.totalMessages}`)
  console.log(`Total Calls: ${results.totalCalls}`)
  console.log(`Duration: ${(results.duration / 1000).toFixed(2)}s`)
  console.log(`Errors: ${results.errors.length}`)
  
  if (results.errors.length > 0) {
    console.log()
    console.log('Errors:')
    results.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`))
    if (results.errors.length > 10) {
      console.log(`  ... and ${results.errors.length - 10} more`)
    }
  }

  console.log()
  console.log('To cleanup test data, run: npx ts-node scripts/simulate-load.ts --cleanup')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
