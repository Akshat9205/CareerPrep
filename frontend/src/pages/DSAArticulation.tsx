import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import {
  ArrowLeft, Mic, Brain, Code2, CheckCircle2, Star, ChevronRight,
  Play, RotateCcw, Send, Volume2, Award, Zap, Clock
} from 'lucide-react';

const dsaProblems = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    diffColor: 'text-emerald-400 bg-emerald-500/10',
    topic: 'Arrays',
    question: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    
Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9`,
    solution: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    explanation: `I used a HashMap (dictionary) to store each number and its index as I iterate.
For each number, I calculate its complement (target - num).
If the complement exists in the HashMap, I found my pair!
Time: O(n), Space: O(n)`,
    voicePrompt: 'Explain your approach to solving Two Sum. Describe your thought process and the data structure you chose.',
    score: 0,
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    diffColor: 'text-emerald-400 bg-emerald-500/10',
    topic: 'Stack',
    question: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
    
Example:
Input: s = "()[]{}"
Output: true`,
    solution: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
    explanation: `I use a Stack data structure. Opening brackets are pushed onto the stack.
For closing brackets, I pop the top of the stack and check if it's the matching opening bracket.
If at any point there's a mismatch, or the stack is empty when we need to pop, return False.
Time: O(n), Space: O(n)`,
    voicePrompt: 'Explain why a Stack is the perfect data structure for this problem.',
    score: 0,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    diffColor: 'text-emerald-400 bg-emerald-500/10',
    topic: 'Binary Search',
    question: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.
    
Example:
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4`,
    solution: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    explanation: `Binary Search works by repeatedly halving the search space.
I maintain two pointers, left and right, defining the search range.
Each iteration I calculate the midpoint and compare with target.
If target is larger, search the right half; if smaller, search left half.
Time: O(log n), Space: O(1)`,
    voicePrompt: 'Explain why Binary Search is O(log n) and when you would use it over linear search.',
    score: 0,
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Medium',
    diffColor: 'text-yellow-400 bg-yellow-500/10',
    topic: 'Linked List',
    question: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Example:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]`,
    solution: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
    explanation: `I use three pointers: prev, curr, and next_node.
In each iteration: save next_node, reverse curr's pointer to prev, advance prev to curr, advance curr to next_node.
This reverses links one at a time without extra memory.
Time: O(n), Space: O(1)`,
    voicePrompt: 'Walk me through how you reverse a linked list. What pointers do you need and why?',
    score: 0,
  },
  {
    id: 'lca-bst',
    title: 'LCA of BST',
    difficulty: 'Medium',
    diffColor: 'text-yellow-400 bg-yellow-500/10',
    topic: 'Trees',
    question: `Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes p and q.

Example:
Input: root = [6,2,8,0,4,7,9], p = 2, q = 8
Output: 6`,
    solution: `def lowest_common_ancestor(root, p, q):
    if p.val < root.val and q.val < root.val:
        return lowest_common_ancestor(root.left, p, q)
    elif p.val > root.val and q.val > root.val:
        return lowest_common_ancestor(root.right, p, q)
    else:
        return root`,
    explanation: `Using BST property: all left values < root < all right values.
If both p and q are less than root, LCA is in the left subtree.
If both are greater, LCA is in the right subtree.
Otherwise, the current node is the LCA (one node is on each side).
Time: O(h) where h is height, Space: O(h) recursion stack`,
    voicePrompt: 'Explain how you exploit the BST property to find the Lowest Common Ancestor efficiently.',
    score: 0,
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Medium',
    diffColor: 'text-yellow-400 bg-yellow-500/10',
    topic: 'Dynamic Programming',
    question: `You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Example:
Input: n = 3
Output: 3 (1+1+1, 1+2, 2+1)`,
    solution: `def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
    explanation: `This is essentially Fibonacci. At step n, I either came from step n-1 (one step) or n-2 (two steps).
So ways[n] = ways[n-1] + ways[n-2].
I use Dynamic Programming (bottom-up) to build the solution iteratively.
Time: O(n), Space: O(n) — can be optimized to O(1) with two variables.`,
    voicePrompt: 'Why is this a DP problem? Explain the recurrence relation and why memoization helps.',
    score: 0,
  },
];

type FlowStep = 'question' | 'solve' | 'explain' | 'voice' | 'feedback' | 'score';

export default function DSAArticulation() {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState<typeof dsaProblems[0] | null>(null);
  const [flowStep, setFlowStep] = useState<FlowStep>('question');
  const [userCode, setUserCode] = useState('');
  const [userExplanation, setUserExplanation] = useState('');
  const [spokenAnswer, setSpokenAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedFilter, setSelectedFilter] = useState('All');

  const topics = ['All', 'Arrays', 'Stack', 'Binary Search', 'Linked List', 'Trees', 'Dynamic Programming'];
  const filteredProblems = selectedFilter === 'All' ? dsaProblems : dsaProblems.filter(p => p.topic === selectedFilter);

  const handleStartProblem = (problem: typeof dsaProblems[0]) => {
    setSelectedProblem(problem);
    setFlowStep('question');
    setUserCode('');
    setUserExplanation('');
    setSpokenAnswer('');
  };

  const handleNextStep = () => {
    const steps: FlowStep[] = ['question', 'solve', 'explain', 'voice', 'feedback', 'score'];
    const current = steps.indexOf(flowStep);
    if (current < steps.length - 1) setFlowStep(steps[current + 1]);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.onresult = (e: any) => {
        setSpokenAnswer(e.results[0][0].transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.start();
    } else {
      setIsRecording(false);
      setSpokenAnswer('Browser does not support speech recognition. Please type below.');
    }
  };

  const computeScore = () => {
    let score = 0;
    if (userCode.length > 20) score += 30;
    if (userExplanation.length > 30) score += 35;
    if (spokenAnswer.length > 20) score += 35;
    const final = Math.min(100, score + Math.floor(Math.random() * 15));
    if (selectedProblem) setScores(prev => ({ ...prev, [selectedProblem.id]: final }));
    return final;
  };

  const flowSteps: { key: FlowStep; label: string; icon: any }[] = [
    { key: 'question', label: 'Question', icon: Code2 },
    { key: 'solve', label: 'Solve', icon: Zap },
    { key: 'explain', label: 'Explain', icon: Brain },
    { key: 'voice', label: 'Voice', icon: Mic },
    { key: 'feedback', label: 'Feedback', icon: Award },
    { key: 'score', label: 'Score', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 md:pl-72 lg:pl-80">
          <div className="max-w-6xl mx-auto">

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <button onClick={() => selectedProblem ? setSelectedProblem(null) : navigate('/dashboard')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">{selectedProblem ? 'Back to Problems' : 'Back to Dashboard'}</span>
              </button>
              <h1 className="text-3xl font-extrabold">
                <span className="gradient-text">DSA</span> Articulation Practice
              </h1>
              <p className="text-muted-foreground mt-1">Solve → Explain → Speak → Get Scored</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {!selectedProblem ? (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Filter Tabs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {topics.map(t => (
                      <button key={t} onClick={() => setSelectedFilter(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                          selectedFilter === t ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}>{t}</button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProblems.map((problem, i) => (
                      <motion.div key={problem.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => handleStartProblem(problem)}
                          className="w-full text-left glass-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all group relative">
                          {scores[problem.id] && (
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-lg">
                              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-bold text-primary">{scores[problem.id]}%</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${problem.diffColor}`}>{problem.difficulty}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">{problem.topic}</span>
                          </div>
                          <h3 className="font-bold text-foreground mb-2">{problem.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{problem.question.slice(0, 100)}...</p>
                          <div className="flex items-center gap-2 mt-4">
                            <div className="flex-1 flex gap-1">
                              {flowSteps.map(s => (
                                <div key={s.key} className="flex-1 h-1 bg-muted rounded-full" />
                              ))}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="problem" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  {/* Flow Steps Progress */}
                  <div className="glass-card rounded-2xl p-4 border border-border/50 mb-6">
                    <div className="flex items-center justify-between gap-2">
                      {flowSteps.map((step, i) => {
                        const stepIndex = flowSteps.findIndex(s => s.key === flowStep);
                        const isDone = i < stepIndex;
                        const isActive = step.key === flowStep;
                        return (
                          <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-primary text-white animate-pulse' : 'bg-muted text-muted-foreground'
                            }`}>
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'} hidden sm:block`}>{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6 border border-border/50">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{selectedProblem.title}</h2>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${selectedProblem.diffColor}`}>{selectedProblem.difficulty}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">{selectedProblem.topic}</span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={flowStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

                        {flowStep === 'question' && (
                          <div>
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Code2 className="w-5 h-5 text-primary" /> Problem Statement
                            </h3>
                            <pre className="bg-muted/30 border border-border/50 rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                              {selectedProblem.question}
                            </pre>
                            <button onClick={handleNextStep}
                              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                              I'm Ready to Solve <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {flowStep === 'solve' && (
                          <div>
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Zap className="w-5 h-5 text-yellow-500" /> Write Your Solution
                            </h3>
                            <textarea
                              value={userCode}
                              onChange={e => setUserCode(e.target.value)}
                              placeholder="# Write your code here..."
                              className="w-full h-48 bg-muted/30 border border-border/50 rounded-xl p-4 text-sm font-mono text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                            />
                            <details className="mt-3">
                              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">💡 View Solution</summary>
                              <pre className="mt-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-sm font-mono text-foreground whitespace-pre-wrap">
                                {selectedProblem.solution}
                              </pre>
                            </details>
                            <button onClick={handleNextStep}
                              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold hover:opacity-90 flex items-center justify-center gap-2">
                              Explain My Solution <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {flowStep === 'explain' && (
                          <div>
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Brain className="w-5 h-5 text-purple-500" /> Explain Your Solution in Writing
                            </h3>
                            <p className="text-xs text-muted-foreground mb-3">Explain your approach, time/space complexity, and any trade-offs.</p>
                            <textarea
                              value={userExplanation}
                              onChange={e => setUserExplanation(e.target.value)}
                              placeholder="My approach was to use... The time complexity is O(...) because... The space complexity is O(...)..."
                              className="w-full h-36 bg-muted/30 border border-border/50 rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                            />
                            <details className="mt-3">
                              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">💡 Sample Explanation</summary>
                              <p className="mt-2 bg-muted/30 border border-border/50 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed">
                                {selectedProblem.explanation}
                              </p>
                            </details>
                            <button onClick={handleNextStep}
                              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold hover:opacity-90 flex items-center justify-center gap-2">
                              Now Speak It Out <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {flowStep === 'voice' && (
                          <div>
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Mic className="w-5 h-5 text-red-500" /> Voice Recording
                            </h3>
                            <div className="p-4 bg-muted/20 border border-border/50 rounded-xl mb-4">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Speak to answer:</p>
                              <p className="text-sm text-foreground">{selectedProblem.voicePrompt}</p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={handleStartRecording} disabled={isRecording}
                                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                                  isRecording ? 'bg-red-500 animate-pulse shadow-red-500/40' : 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/20'
                                }`}>
                                <Mic className="w-8 h-8 text-white" />
                              </motion.button>
                              <p className="text-sm text-muted-foreground">{isRecording ? '🎙️ Recording...' : 'Tap to record your explanation'}</p>
                            </div>
                            {spokenAnswer && (
                              <div className="mt-4 p-4 bg-muted/30 border border-border/50 rounded-xl">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Transcribed:</p>
                                <p className="text-sm text-foreground">{spokenAnswer}</p>
                              </div>
                            )}
                            <textarea
                              value={spokenAnswer}
                              onChange={e => setSpokenAnswer(e.target.value)}
                              placeholder="Or type your explanation here..."
                              className="mt-3 w-full h-24 bg-muted/30 border border-border/50 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                            />
                            <button onClick={handleNextStep}
                              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:opacity-90 flex items-center justify-center gap-2">
                              Get AI Feedback <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {flowStep === 'feedback' && (
                          <div>
                            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Award className="w-5 h-5 text-yellow-500" /> AI Feedback (Placeholder)
                            </h3>
                            <div className="space-y-3">
                              {[
                                { label: 'Code Quality', value: userCode.length > 30 ? 85 : 40, color: 'from-blue-500 to-cyan-500' },
                                { label: 'Written Explanation', value: userExplanation.length > 30 ? 80 : 35, color: 'from-purple-500 to-violet-500' },
                                { label: 'Voice Clarity', value: spokenAnswer.length > 20 ? 75 : 30, color: 'from-red-500 to-pink-500' },
                                { label: 'Complexity Analysis', value: (userExplanation.toLowerCase().includes('o(') || spokenAnswer.toLowerCase().includes('o(')) ? 90 : 45, color: 'from-emerald-500 to-teal-500' },
                              ].map(item => (
                                <div key={item.label}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-foreground font-medium">{item.label}</span>
                                    <span className="text-muted-foreground">{item.value}%</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`} />
                                  </div>
                                </div>
                              ))}
                              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mt-4">
                                <p className="text-sm text-emerald-400 font-medium mb-2">✅ AI Suggestions:</p>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                  <li>• {userCode.length < 30 ? 'Write actual code to demonstrate your solution' : 'Good code structure!'}</li>
                                  <li>• {userExplanation.toLowerCase().includes('o(') ? 'Great! You mentioned complexity.' : 'Always mention time and space complexity'}</li>
                                  <li>• {spokenAnswer.length > 20 ? 'Strong verbal explanation.' : 'Practice speaking your explanation clearly'}</li>
                                  <li>• Mention edge cases (empty array, negative numbers, etc.)</li>
                                </ul>
                              </div>
                            </div>
                            <button onClick={() => { computeScore(); handleNextStep(); }}
                              className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold hover:opacity-90 flex items-center justify-center gap-2">
                              See Final Score <Star className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {flowStep === 'score' && (
                          <div className="text-center py-8">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}
                              className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/30">
                              <div>
                                <p className="text-4xl font-extrabold text-white">{scores[selectedProblem.id] || 75}%</p>
                                <p className="text-xs text-white/80">Score</p>
                              </div>
                            </motion.div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                              {(scores[selectedProblem.id] || 75) >= 80 ? '🎉 Excellent!' : (scores[selectedProblem.id] || 75) >= 60 ? '👍 Good Job!' : '💪 Keep Practicing!'}
                            </h3>
                            <p className="text-muted-foreground mb-8">You completed {selectedProblem.title} in the full articulation flow!</p>
                            <div className="flex gap-3 justify-center">
                              <button onClick={() => setSelectedProblem(null)}
                                className="px-6 py-3 rounded-xl border border-border/50 text-foreground hover:border-primary/30 transition-all font-medium">
                                More Problems
                              </button>
                              <button onClick={() => { setFlowStep('question'); setUserCode(''); setUserExplanation(''); setSpokenAnswer(''); }}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:opacity-90 flex items-center gap-2">
                                <RotateCcw className="w-4 h-4" /> Retry
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
