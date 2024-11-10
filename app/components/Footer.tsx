import Link from 'next/link'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Shafayet Ahmmed</h3>
            <p className="text-gray-600 dark:text-gray-400">Full Stack Developer</p>
          </div>
          <div className="flex space-x-4">
            <SocialLink href="https://github.com" icon={<FaGithub />} />
            <SocialLink href="https://linkedin.com" icon={<FaLinkedin />} />
            <SocialLink href="https://twitter.com" icon={<FaTwitter />} />
          </div>
        </div>
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Shafayet Ahmmed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <Link href={href} className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors duration-300">
    {icon}
  </Link>
)

export default Footer