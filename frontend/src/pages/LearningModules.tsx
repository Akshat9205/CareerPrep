import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Mic, Building2, PlayCircle, Star, CheckCircle2, Search, X, ChevronLeft, Video, Upload, BrainCircuit, Code2, Clock, Tag, ChevronDown, ChevronUp, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Module {
  title: string;
  duration: string;
  completed: boolean;
  round: 'General' | 'HR' | 'Technical' | 'Behavioral' | 'System Design' | 'Cultural';
}

interface OAQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  year: string;
  description: string;
  examples: { input: string; output: string }[];
}

interface Company {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  iconColor: string;
  description: string;
  modules: Module[];
  mockInterviews: string;
  oaQuestions: OAQuestion[];
}

const companies: Company[] = [
  {
    id: 'google',
    name: 'Google',
    color: 'from-blue-500/20 to-green-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    description: 'Master analytical communication and technical problem-solving discussions.',
    modules: [
      { title: 'Technical Design Discussions', duration: '45 mins', completed: true, round: 'Technical' },
      { title: 'Googleyness & Behavioral', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'Data Structures Articulation', duration: '1.5 hours', completed: false, round: 'Technical' }
    ],
    mockInterviews: '4 Available',
    oaQuestions: [
      {
        id: 1, title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'HashMap'], year: '2023',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }]
      },
      {
        id: 2, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['Sliding Window', 'HashMap'], year: '2023',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        examples: [{ input: 's = "abcabcbb"', output: '3' }]
      },
      {
        id: 3, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Binary Search', 'Array'], year: '2022',
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
        examples: [{ input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000' }]
      },
      {
        id: 4, title: 'Word Ladder', difficulty: 'Hard', tags: ['BFS', 'Graph'], year: '2022',
        description: 'Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence.',
        examples: [{ input: 'beginWord = "hit", endWord = "cog"', output: '5' }]
      },
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    color: 'from-orange-500/20 to-yellow-500/20',
    borderColor: 'border-orange-500/30',
    iconColor: 'text-orange-500',
    description: 'Learn to speak through Leadership Principles using the STAR method.',
    modules: [
      { title: 'STAR Method Mastery', duration: '1.5 hours', completed: false, round: 'Behavioral' },
      { title: 'Leadership Principles Vocab', duration: '45 mins', completed: false, round: 'HR' },
      { title: 'Customer Obsession Roleplay', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'LDP Deep Dive: Ownership', duration: '50 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '6 Available',
    oaQuestions: [
      {
        id: 1, title: 'Number of Islands', difficulty: 'Medium', tags: ['BFS', 'DFS', 'Matrix'], year: '2023',
        description: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.',
        examples: [{ input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: '2' }]
      },
      {
        id: 2, title: 'LRU Cache', difficulty: 'Medium', tags: ['Design', 'HashMap', 'LinkedList'], year: '2023',
        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
        examples: [{ input: 'capacity = 2, [put(1,1), put(2,2), get(1), put(3,3), get(2)]', output: '1, -1' }]
      },
      {
        id: 3, title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Two Pointers', 'Stack'], year: '2022',
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }]
      },
      {
        id: 4, title: 'Maximum Subarray', difficulty: 'Easy', tags: ['DP', 'Array'], year: '2022',
        description: 'Given an integer array nums, find the subarray which has the largest sum and return its sum.',
        examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' }]
      },
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
    description: 'Focus on collaborative communication and growth mindset expression.',
    modules: [
      { title: 'Collaborative Problem Solving', duration: '50 mins', completed: false, round: 'Technical' },
      { title: 'System Design English Articulation', duration: '1.2 hours', completed: false, round: 'System Design' },
      { title: 'Growth Mindset Discussion', duration: '45 mins', completed: false, round: 'Behavioral' },
    ],
    mockInterviews: '3 Available',
    oaQuestions: [
      {
        id: 1, title: 'Reverse Linked List', difficulty: 'Easy', tags: ['LinkedList', 'Recursion'], year: '2023',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }]
      },
      {
        id: 2, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', tags: ['BFS', 'Tree'], year: '2023',
        description: `Given the root of a binary tree, return the level order traversal of its nodes' values.`,
        examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }]
      },
      {
        id: 3, title: 'Clone Graph', difficulty: 'Medium', tags: ['Graph', 'BFS', 'DFS'], year: '2022',
        description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
        examples: [{ input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' }]
      },
    ]
  },
  {
    id: 'meta',
    name: 'Meta',
    color: 'from-blue-600/20 to-blue-400/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    description: 'Fast-paced execution communication and scaling discussions.',
    modules: [
      { title: 'Fast-paced Product Sense', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'Execution & Impact Articulation', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'Technical Screen: Algorithms', duration: '1.5 hours', completed: false, round: 'Technical' },
      { title: 'HR Round: Culture & Values', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Move Fast: Team Communication', duration: '40 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '5 Available',
    oaQuestions: [
      {
        id: 1, title: 'Valid Parentheses', difficulty: 'Easy', tags: ['Stack', 'String'], year: '2023',
        description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
        examples: [{ input: 's = "()[]{}"', output: 'true' }]
      },
      {
        id: 2, title: 'Merge Intervals', difficulty: 'Medium', tags: ['Sorting', 'Array'], year: '2023',
        description: 'Given an array of intervals, merge all overlapping intervals, and return an array of the non-overlapping intervals.',
        examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }]
      },
      {
        id: 3, title: 'Find Median from Data Stream', difficulty: 'Hard', tags: ['Heap', 'Design'], year: '2022',
        description: 'The median is the middle value in an ordered integer list. Implement the MedianFinder class that supports addNum and findMedian operations.',
        examples: [{ input: '[addNum(1), addNum(2), findMedian(), addNum(3), findMedian()]', output: '1.5, 2.0' }]
      },
    ]
  },
  {
    id: 'apple',
    name: 'Apple',
    color: 'from-gray-500/20 to-slate-500/20',
    borderColor: 'border-gray-500/30',
    iconColor: 'text-gray-400',
    description: 'Communicate with precision, creativity, and a user-centric mindset.',
    modules: [
      { title: 'Design Thinking Communication', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'HR Round: Passion & Vision Talk', duration: '35 mins', completed: false, round: 'HR' },
      { title: 'Innovation Storytelling', duration: '50 mins', completed: false, round: 'Behavioral' },
      { title: 'Basic Communication: Clarity & Precision', duration: '40 mins', completed: false, round: 'General' },
      { title: 'Apple Values: Culture Round', duration: '45 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '3 Available',
    oaQuestions: [
      {
        id: 1, title: 'Product of Array Except Self', difficulty: 'Medium', tags: ['Array', 'Prefix Sum'], year: '2023',
        description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
        examples: [{ input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' }]
      },
      {
        id: 2, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', tags: ['Tree', 'BFS', 'Design'], year: '2022',
        description: 'Serialization is the process of converting a data structure into a sequence of bits. Design an algorithm to serialize and deserialize a binary tree.',
        examples: [{ input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]' }]
      },
    ]
  },
  {
    id: 'netflix',
    name: 'Netflix',
    color: 'from-red-600/20 to-red-400/20',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-500',
    description: 'Freedom & Responsibility culture — express independent thinking and judgment.',
    modules: [
      { title: 'Freedom & Responsibility Language', duration: '45 mins', completed: false, round: 'Cultural' },
      { title: 'HR Round: Self-Management Discussion', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'High Performance Communication', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'Technical Excellence Articulation', duration: '1.5 hours', completed: false, round: 'Technical' },
    ],
    mockInterviews: '4 Available',
    oaQuestions: [
      {
        id: 1, title: 'Top K Frequent Elements', difficulty: 'Medium', tags: ['Heap', 'HashMap', 'Sorting'], year: '2023',
        description: 'Given an integer array nums and an integer k, return the k most frequent elements.',
        examples: [{ input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' }]
      },
      {
        id: 2, title: 'Design Movie Recommendation System', difficulty: 'Hard', tags: ['Design', 'Graph'], year: '2022',
        description: 'Design a system that recommends movies to users based on their watch history using a graph-based collaborative filtering approach.',
        examples: [{ input: 'userHistory = [[1,2,3],[2,3,4],[3,4,5]]', output: 'Recommended: [4] for user 0' }]
      },
    ]
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    color: 'from-yellow-500/20 to-orange-400/20',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-500',
    description: 'Master e-commerce domain English and India-specific business communication.',
    modules: [
      { title: 'E-commerce Product Communication', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'HR Round: Background & Strengths', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Data-Driven Decision English', duration: '50 mins', completed: false, round: 'Behavioral' },
      { title: 'Basic Communication: Hindi-English Mix', duration: '45 mins', completed: false, round: 'General' },
      { title: 'Team Collaboration Roleplay', duration: '40 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '5 Available',
    oaQuestions: [
      {
        id: 1, title: 'Minimum Platforms Required', difficulty: 'Medium', tags: ['Greedy', 'Sorting'], year: '2023',
        description: 'Given arrival and departure times of all trains that reach a railway station, find the minimum number of platforms required.',
        examples: [{ input: 'arr = [900,940,950,1100], dep = [910,1200,1120,1130]', output: '3' }]
      },
      {
        id: 2, title: 'Stock Buy Sell to Maximize Profit', difficulty: 'Medium', tags: ['Greedy', 'Array'], year: '2023',
        description: 'Find max profit from stock prices where you can buy and sell multiple times.',
        examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '7' }]
      },
      {
        id: 3, title: 'Rotting Oranges', difficulty: 'Medium', tags: ['BFS', 'Matrix'], year: '2022',
        description: 'Given an m x n grid where each cell can have a fresh orange, rotten orange, or be empty, return the minimum number of minutes that must elapse until no cell has a fresh orange.',
        examples: [{ input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4' }]
      },
    ]
  },
  {
    id: 'infosys',
    name: 'Infosys',
    color: 'from-blue-400/20 to-cyan-400/20',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
    description: 'Navigate IT service communication, client interaction, and corporate English.',
    modules: [
      { title: 'Client Communication Fundamentals', duration: '1 hour', completed: false, round: 'General' },
      { title: 'HR Round: Introduction & Hobbies', duration: '25 mins', completed: false, round: 'HR' },
      { title: 'Technical Round: Project Discussion', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'Professional Email Writing', duration: '45 mins', completed: false, round: 'General' },
      { title: 'Group Discussion English Skills', duration: '50 mins', completed: false, round: 'Behavioral' },
    ],
    mockInterviews: '6 Available',
    oaQuestions: [
      {
        id: 1, title: 'Check Balanced Parentheses', difficulty: 'Easy', tags: ['Stack', 'String'], year: '2023',
        description: 'Given a string of parentheses, check if the string is balanced.',
        examples: [{ input: 's = "{[()]}"', output: 'true' }]
      },
      {
        id: 2, title: 'Find Duplicate in Array', difficulty: 'Easy', tags: ['Array', 'HashMap'], year: '2023',
        description: 'Given an array nums containing n+1 integers where each integer is in the range [1, n], find the duplicate number.',
        examples: [{ input: 'nums = [1,3,4,2,2]', output: '2' }]
      },
      {
        id: 3, title: 'Pascal\'s Triangle', difficulty: 'Easy', tags: ['Array', 'DP'], year: '2022',
        description: 'Given an integer numRows, return the first numRows of Pascal\'s triangle.',
        examples: [{ input: 'numRows = 5', output: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]' }]
      },
    ]
  },
  {
    id: 'tcs',
    name: 'TCS',
    color: 'from-purple-500/20 to-violet-400/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    description: 'Master structured English for IT roles, appraisals, and client-facing conversations.',
    modules: [
      { title: 'HR Round: Tell Me About Yourself', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Basic Communication: Telephonic Etiquette', duration: '40 mins', completed: false, round: 'General' },
      { title: 'Technical Round: Tech Stack Discussion', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'MRF Interview Communication', duration: '50 mins', completed: false, round: 'Behavioral' },
      { title: 'Corporate Culture Onboarding English', duration: '35 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '7 Available',
    oaQuestions: [
      {
        id: 1, title: 'Fibonacci Series', difficulty: 'Easy', tags: ['DP', 'Recursion'], year: '2023',
        description: 'Given a number n, find the nth Fibonacci number. Optimize for large n.',
        examples: [{ input: 'n = 10', output: '55' }]
      },
      {
        id: 2, title: 'Prime Numbers in Range', difficulty: 'Easy', tags: ['Math', 'Sieve'], year: '2023',
        description: 'Given two numbers L and R, find all prime numbers between L and R.',
        examples: [{ input: 'L = 1, R = 20', output: '[2,3,5,7,11,13,17,19]' }]
      },
      {
        id: 3, title: 'String Anagram Check', difficulty: 'Easy', tags: ['String', 'HashMap'], year: '2022',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
        examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }]
      },
    ]
  },
  {
    id: 'wipro',
    name: 'Wipro',
    color: 'from-green-500/20 to-emerald-400/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    description: 'Build fluency for IT service roles, aptitude rounds, and managerial communication.',
    modules: [
      { title: 'HR Round: Strengths & Weaknesses', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Basic Communication: Pronunciation', duration: '45 mins', completed: false, round: 'General' },
      { title: 'Aptitude Round: Analytical Vocabulary', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'Situational Behavioral English', duration: '50 mins', completed: false, round: 'Behavioral' },
      { title: 'Wipro Values Discussion', duration: '35 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '5 Available',
    oaQuestions: [
      {
        id: 1, title: 'Reverse a String', difficulty: 'Easy', tags: ['String', 'Two Pointers'], year: '2023',
        description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
        examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }]
      },
      {
        id: 2, title: 'Binary Search', difficulty: 'Easy', tags: ['Array', 'Binary Search'], year: '2023',
        description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
        examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }]
      },
    ]
  },
  {
    id: 'adobe',
    name: 'Adobe',
    color: 'from-red-500/20 to-pink-500/20',
    borderColor: 'border-red-400/30',
    iconColor: 'text-red-400',
    description: 'Communicate creativity, product thinking, and technical depth in English.',
    modules: [
      { title: 'Product Design Communication', duration: '55 mins', completed: false, round: 'Technical' },
      { title: 'HR Round: Creativity & Goals', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Creative Problem Solving Language', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'System Design for Creative Tools', duration: '1.5 hours', completed: false, round: 'System Design' },
      { title: 'Adobe Culture: Genuine & Exceptional', duration: '40 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '3 Available',
    oaQuestions: [
      {
        id: 1, title: 'Image Rotate 90 Degrees', difficulty: 'Medium', tags: ['Matrix', 'Array'], year: '2023',
        description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise) in-place.',
        examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' }]
      },
      {
        id: 2, title: 'Design Paint Application', difficulty: 'Hard', tags: ['Design', 'OOP'], year: '2022',
        description: 'Design a basic paint application that supports brush, fill, and undo operations. Focus on OOP design patterns.',
        examples: [{ input: 'ops = [draw(1,1), fill(red), undo()]', output: 'canvas state after each op' }]
      },
    ]
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    color: 'from-sky-500/20 to-blue-400/20',
    borderColor: 'border-sky-500/30',
    iconColor: 'text-sky-400',
    description: 'Master CRM domain English, customer success language, and Ohana culture talks.',
    modules: [
      { title: 'Customer Success Communication', duration: '1 hour', completed: false, round: 'General' },
      { title: 'HR Round: Why Salesforce?', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Technical Round: CRM & APIs', duration: '1.5 hours', completed: false, round: 'Technical' },
      { title: 'Ohana Culture & Values Talk', duration: '40 mins', completed: false, round: 'Cultural' },
      { title: 'STAR Stories: Trailblazer Moments', duration: '50 mins', completed: false, round: 'Behavioral' },
    ],
    mockInterviews: '4 Available',
    oaQuestions: [
      {
        id: 1, title: 'Design CRM Contact System', difficulty: 'Medium', tags: ['Design', 'OOP'], year: '2023',
        description: 'Design a contact management system with CRUD operations, search, and relationship tracking between contacts and accounts.',
        examples: [{ input: 'ops = [addContact("John"), addAccount("Acme"), link(John, Acme)]', output: 'Contact linked to Account' }]
      },
      {
        id: 2, title: 'Rate Limiter API', difficulty: 'Medium', tags: ['Design', 'HashMap'], year: '2022',
        description: 'Design a rate limiter that limits the number of API requests a user can make in a given time window.',
        examples: [{ input: 'limit = 3, window = 1s, requests = [t=0, t=0.4, t=0.6, t=0.8]', output: '[true, true, true, false]' }]
      },
    ]
  }
];

const ALL_BASIC_MODULES = [
  { title: "Grammar Fundamentals for Tech Roles", duration: "1.5 hours", completed: false },
  { title: "Professional Workplace Vocabulary", duration: "2 hours", completed: false },
  { title: "Formal Email & Written Communication", duration: "1 hour", completed: false },
  { title: "Speaking Confidently in Meetings", duration: "2.5 hours", completed: false },
  { title: "Structuring Common Interview Answers", duration: "1.5 hours", completed: false },
  { title: "Small Talk & Networking English", duration: "45 mins", completed: false }
];

const difficultyConfig = {
  Easy: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  Hard: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
};

const LearningModules = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyParam = searchParams.get('company');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRound, setSelectedRound] = useState('All');
  const [showMockModal, setShowMockModal] = useState(false);
  const [showOAPanel, setShowOAPanel] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [completedOAQuestions, setCompletedOAQuestions] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('completedOAQuestions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [basicModules, setBasicModules] = useState(ALL_BASIC_MODULES);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [hideSidebar, setHideSidebar] = useState(false);
  const { user } = useAuth();

  const toggleOACompletion = (e: React.MouseEvent, questionId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCompletedOAQuestions(prev => {
      const next = { ...prev, [questionId]: !prev[questionId] };
      localStorage.setItem('completedOAQuestions', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (user) fetchUserProgress();
    fetchPublishedModules();
    if (companyParam) {
      const company = companies.find(c => c.id === companyParam);
      if (company) {
        setSelectedCompany(company);
        setHideSidebar(true);
      }
    }
  }, [user, companyParam]);

  const fetchPublishedModules = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/modules');
      const data = await res.json();
      if (data.success && data.modules.length > 0) {
        const publishedTitles = new Set(data.modules.map((m: any) => m.title));
        setBasicModules(ALL_BASIC_MODULES.filter(m => publishedTitles.has(m.title)));
      }
    } catch { /* Backend unavailable → show all modules */ }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/progress/${user?.uid}`);
      const data = await response.json();
      if (data.success) setUserProgress(data.progress || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const getModuleProgress = (title: string) => {
    const moduleId = title.toLowerCase().replace(/\s+/g, '-');
    const progress = userProgress.find(p => p.moduleId === moduleId);
    return progress ? progress.progressPercentage : 0;
  };

  const isModuleCompleted = (title: string) => getModuleProgress(title) >= 100;

  // Filter: when "Technical" is selected, only show Technical round modules
  const rounds = selectedCompany
    ? ['All', ...Array.from(new Set(selectedCompany.modules.map(m => m.round)))]
    : ['All'];

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModules = selectedCompany
    ? selectedCompany.modules.filter(m => selectedRound === 'All' || m.round === selectedRound)
    : [];

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setSelectedRound('All');
    setSearchQuery('');
    setShowOAPanel(false);
    setExpandedQuestion(null);
  };

  const handleOAPractice = () => {
    setShowOAPanel(true);
    setExpandedQuestion(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            {!hideSidebar && (
              <div className="w-full lg:w-1/3 xl:w-1/4">
                <div className="glass-card p-6 rounded-2xl sticky top-24 border border-border/50">
                  <h3 className="text-xl font-bold mb-2">Target Company</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Aiming for a specific dream company? Enter it below to unlock customized English modules for their interview process.
                  </p>

                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search company..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                        {filteredCompanies.map(c => (
                          <button
                            key={c.id}
                            className="w-full text-left px-4 py-3 hover:bg-muted/50 flex items-center gap-3"
                            onClick={() => handleSelectCompany(c)}
                          >
                            <Building2 className={`w-5 h-5 ${c.iconColor}`} />
                            <span className="font-medium text-sm">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Top Companies</p>
                    <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                      {companies.map(comp => (
                        <button
                          key={comp.id}
                          onClick={() => handleSelectCompany(comp)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCompany?.id === comp.id
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'text-muted-foreground border-transparent hover:bg-muted'
                            }`}
                        >
                          <Building2 className={`w-4 h-4 shrink-0 ${comp.iconColor}`} />
                          <span>{comp.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className={`${hideSidebar ? 'w-full' : 'w-full lg:w-2/3 xl:w-3/4'}`}>
              <AnimatePresence mode="wait">
                {selectedCompany ? (
                  <motion.div key="company-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <button
                      onClick={() => { setSelectedCompany(null); setShowOAPanel(false); }}
                      className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back to Core Modules
                    </button>

                    <div className={`glass-card rounded-2xl p-8 border relative overflow-hidden ${selectedCompany.borderColor}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${selectedCompany.color} opacity-10 pointer-events-none`} />

                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-background border ${selectedCompany.borderColor}`}>
                            <Building2 className={`w-8 h-8 ${selectedCompany.iconColor}`} />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold">{selectedCompany.name} Tracks</h2>
                            {showOAPanel && (
                              <span className="text-sm text-amber-400 font-medium">OA Practice — Previous Year Questions</span>
                            )}
                          </div>
                        </div>

                        {/* ── OA PRACTICE PANEL ── */}
                        <AnimatePresence mode="wait">
                          {showOAPanel ? (
                            <motion.div
                              key="oa-panel"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -16 }}
                              className="space-y-4"
                            >
                              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                                    Must-Do Problems
                                  </h3>
                                </div>
                                <button
                                  onClick={() => setShowOAPanel(false)}
                                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors bg-muted/40 hover:bg-muted/80 px-2.5 py-1.5 rounded-lg border border-border"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" /> Back to Modules
                                </button>
                              </div>

                              <div className="space-y-4">
                                {selectedCompany.oaQuestions.map((q) => {
                                  const isExpanded = expandedQuestion === q.id;
                                  const isCompleted = !!completedOAQuestions[q.id];
                                  return (
                                    <div
                                      key={q.id}
                                      className="rounded-xl border border-border/40 bg-background/40 hover:bg-background/80 transition-colors p-4"
                                    >
                                      <div className="flex items-start gap-3.5">
                                        {/* Toggle Completed Circle */}
                                        <button
                                          onClick={(e) => toggleOACompletion(e, q.id)}
                                          className="mt-0.5 shrink-0 transition-transform active:scale-95"
                                        >
                                          {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                          ) : (
                                            <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                                          )}
                                        </button>

                                        {/* Question Details */}
                                        <div className="flex-1 min-w-0">
                                          <button
                                            onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                                            className="w-full text-left"
                                          >
                                            <span className={`font-semibold text-base transition-colors ${
                                              isCompleted ? 'text-muted-foreground line-through' : 'text-foreground hover:text-emerald-400'
                                            }`}>
                                              {q.title}
                                            </span>
                                            
                                            <div className="flex items-center gap-3.5 mt-1">
                                              <span className={`text-xs font-bold uppercase tracking-wider ${
                                                q.difficulty === 'Easy' ? 'text-emerald-400' : q.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'
                                              }`}>
                                                {q.difficulty}
                                              </span>
                                              <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Asked in {q.year}
                                              </span>
                                              <div className="flex flex-wrap gap-1">
                                                {q.tags.map(tag => (
                                                  <span key={tag} className="text-[10px] text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded-full border border-border/30">
                                                    {tag}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          </button>
                                        </div>

                                        {/* Expand Chevron */}
                                        <button
                                          onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                                          className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                                        >
                                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                      </div>

                                      {/* Dropdown description & examples */}
                                      <AnimatePresence>
                                        {isExpanded && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden mt-3 pt-3 border-t border-border/30"
                                          >
                                            <div className="space-y-3.5">
                                              <p className="text-sm text-muted-foreground leading-relaxed">
                                                {q.description}
                                              </p>
                                              <div className="space-y-2">
                                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Example</p>
                                                {q.examples.map((ex, i) => (
                                                  <div key={i} className="rounded-lg bg-muted/30 border border-border/30 p-3.5 text-xs font-mono space-y-1.5">
                                                    <div><span className="text-emerald-400">Input: </span>{ex.input}</div>
                                                    <div><span className="text-amber-400">Output: </span>{ex.output}</div>
                                                  </div>
                                                ))}
                                              </div>
                                              <div className="pt-2 flex justify-end">
                                                <Button
                                                  size="sm"
                                                  onClick={() => navigate('/mock-interview')}
                                                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                >
                                                  Practice Interview
                                                </Button>
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Explore All Problems outline button */}
                              <div className="pt-6 border-t border-border/30 flex justify-center">
                                <Button
                                  variant="outline"
                                  onClick={() => navigate('/learning')}
                                  className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-bold px-8 h-11 rounded-xl transition-all shadow-md shadow-emerald-500/5 uppercase text-xs tracking-wider"
                                >
                                  Explore All Problems
                                </Button>
                              </div>
                            </motion.div>
                          ) : (

                            /* ── LEARNING MODULES PANEL ── */
                            <motion.div
                              key="modules-panel"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -16 }}
                              className="space-y-6"
                            >
                              <p className="text-lg text-muted-foreground">{selectedCompany.description}</p>

                              <div>
                                {/* Round filter tabs */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" /> Customized Learning Paths
                                  </h3>
                                  <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                                    {rounds.map(round => (
                                      <button
                                        key={round}
                                        onClick={() => setSelectedRound(round)}
                                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${selectedRound === round
                                          ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                          : 'bg-background/50 text-muted-foreground border-border hover:border-primary/30 hover:text-primary'
                                          }`}
                                      >
                                        {round}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Module list — filtered by selected round */}
                                <div className="grid gap-3">
                                  {filteredModules.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground text-sm">
                                      No modules found for <span className="text-primary font-medium">{selectedRound}</span> round.
                                    </div>
                                  ) : filteredModules.map((mod, i) => (
                                    <div
                                      key={i}
                                      onClick={() => navigate(`/module/${mod.title.toLowerCase().replace(/\s+/g, '-')}`)}
                                      className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group/item"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${mod.completed ? 'bg-green-500/10' : 'bg-primary/10 group-hover/item:bg-primary/20'}`}>
                                          {mod.completed
                                            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            : <PlayCircle className="w-5 h-5 text-primary" />}
                                        </div>
                                        <div>
                                          <span className="font-medium block">{mod.title}</span>
                                          <span className="text-xs text-muted-foreground">Interactive English Lesson</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {mod.completed && (
                                            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded uppercase">Finished</span>
                                          )}
                                          <span className="text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-md border border-border/50 font-medium">
                                            {mod.duration}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="pt-8 border-t border-border/50">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <button
                                    onClick={() => navigate(`/resume-analysis?company=${selectedCompany.id}`)}
                                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-background/50 border border-border/50 hover:bg-muted/50 transition-colors group/qa"
                                  >
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover/qa:bg-primary/20 transition-colors">
                                      <Upload className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-center">
                                      <p className="font-medium text-sm">Upload Resume</p>
                                      <p className="text-xs text-muted-foreground">ATS Optimization</p>
                                    </div>
                                  </button>

                                  <button
                                    onClick={() => navigate('/mock-interview')}
                                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-background/50 border border-border/50 hover:bg-muted/50 transition-colors group/qa"
                                  >
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover/qa:bg-secondary/20 transition-colors">
                                      <Mic className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div className="text-center">
                                      <p className="font-medium text-sm">Interview Prep</p>
                                      <p className="text-xs text-muted-foreground">Mock Interviews</p>
                                    </div>
                                  </button>

                                  {/* OA Practice — navigates to company-specific OA questions */}
                                  <button
                                    onClick={handleOAPractice}
                                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-background/50 border border-border/50 hover:bg-green-500/10 hover:border-green-500/30 transition-colors group/qa"
                                  >
                                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover/qa:bg-green-500/20 transition-colors">
                                      <BrainCircuit className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div className="text-center">
                                      <p className="font-medium text-sm">OA Practice</p>
                                      <p className="text-xs text-muted-foreground">DSA &amp; MCQs</p>
                                    </div>
                                  </button>
                                </div>
                              </div>

                              {/* Mock Interview CTA */}
                              <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                    <Mic className="w-6 h-6 text-secondary" />
                                  </div>
                                  <div>
                                    <p className="font-semibold">{selectedCompany.name} Mock Interviews</p>
                                    <p className="text-sm text-muted-foreground">{selectedCompany.mockInterviews}</p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => setShowMockModal(true)}
                                  className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25 h-12 px-8 text-base"
                                >
                                  Start Practice
                                  <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="basic-view" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="mb-8">
                      <h1 className="text-4xl font-bold mb-4">Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">English Learning</span></h1>
                    </div>

                    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-border/50">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-semibold mb-1">Fundamentals Track</h2>
                          <div className="text-sm text-muted-foreground">
                            {basicModules.filter(m => isModuleCompleted(m.title)).length}/6 Modules Completed
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          {(() => {
                            const completedCount = basicModules.filter(m => isModuleCompleted(m.title)).length;
                            const totalPercentage = Math.round((completedCount / basicModules.length) * 100);
                            return (
                              <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted stroke-[3]" />
                                  <circle
                                    cx="18" cy="18" r="16" fill="none"
                                    className="stroke-primary stroke-[3] transition-all duration-1000"
                                    strokeDasharray="100"
                                    strokeDashoffset={100 - totalPercentage}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                                  {totalPercentage}%
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {basicModules.map((mod, i) => {
                          const completed = isModuleCompleted(mod.title);
                          return (
                            <div
                              key={i}
                              onClick={() => navigate(`/module/${mod.title.toLowerCase().replace(/\s+/g, '-')}`)}
                              className={`flex items-center justify-between p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer group
                                ${completed ? 'bg-muted/30 border-border/50' : 'bg-background hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 border-border'}
                              `}>
                              <div className="flex items-center gap-4 sm:gap-6">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors
                                  ${completed ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                                `}>
                                  {completed ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{i + 1}</span>}
                                </div>
                                <div>
                                  <h3 className={`font-semibold sm:text-lg mb-1 ${completed ? 'text-muted-foreground' : 'text-foreground'}`}>
                                    {mod.title}
                                  </h3>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <BookOpen className="w-3.5 h-3.5" /> Core Lesson
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span>{mod.duration}</span>
                                    {completed && (
                                      <>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span className="text-green-500 font-bold uppercase text-[10px]">Finished</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="hidden sm:flex shrink-0">
                                {completed ? (
                                  <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600 hover:bg-green-500/10">Review</Button>
                                ) : (
                                  <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    Start Module <PlayCircle className="w-4 h-4 ml-2" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Video Modal */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none shadow-2xl">
          <div className="relative aspect-video">
            {activeVideo && (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="Company Module Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mock Interview Modal */}
      <Dialog open={showMockModal} onOpenChange={setShowMockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start {selectedCompany?.name} Interview</DialogTitle>
            <DialogDescription>Get ready for a 30-minute AI-driven mock interview session.</DialogDescription>
          </DialogHeader>
          <div className="my-6 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40 border border-border">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Camera &amp; Microphone Access</p>
                <p className="text-muted-foreground">Required for facial expression analysis and voice recording.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40 border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">AI Feedback Engine</p>
                <p className="text-muted-foreground">You will receive a detailed ATS/fluency score immediately after.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowMockModal(false)}>Cancel</Button>
            <Button className="bg-gradient-primary" onClick={() => navigate('/interview')}>Launch Interview</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningModules;
