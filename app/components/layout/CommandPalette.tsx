import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  onClose: () => void;
}

interface Command {
  label: string;
  href: string;
  description: string;
}

const commands: Command[] = [
  {
    label: 'Go to Home',
    href: '/',
    description: 'Navigate to the home page',
  },
  {
    label: 'Go to Projects',
    href: '/projects',
    description: 'View all projects',
  },
  {
    label: 'Go to About',
    href: '/about',
    description: 'Learn more about me',
  },
  {
    label: 'Go to Contact',
    href: '/contact',
    description: 'Get in touch',
  },
];

export const CommandPalette = ({ onClose }: CommandPaletteProps) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedCommand = filteredCommands[selectedIndex];
      if (selectedCommand) {
        router.push(selectedCommand.href);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] px-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-[#252526] rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#333333]">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="w-full bg-[#3c3c3c] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007acc]"
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.map((command, index) => (
            <motion.button
              key={command.href}
              className={`w-full px-4 py-3 text-left hover:bg-[#2a2d2e] transition-colors ${
                index === selectedIndex ? 'bg-[#37373d]' : ''
              }`}
              onClick={() => {
                router.push(command.href);
                onClose();
              }}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="text-white font-medium">{command.label}</div>
              <div className="text-sm text-[#cccccc]">{command.description}</div>
            </motion.button>
          ))}

          {filteredCommands.length === 0 && (
            <div className="px-4 py-3 text-[#cccccc]">
              No commands found
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}; 