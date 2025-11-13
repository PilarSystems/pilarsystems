import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const BlogMenu = () => {
  return (
    <MobileMenuItem id="blog" title="Blog" hasSubmenu={true}>
      <ul>
        <li>
          <Link
            href="/blog-01"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300">
            Blog Übersicht
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

export default BlogMenu;
