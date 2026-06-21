import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowLeft, Home, RotateCcw,
  ChevronRight, Trophy
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import destinations from '@/data/destinations';
import {
  computeQuizRecommendations,
  type QuizAnswers,
  type QuizResult
} from '@/utils/quizRecommend';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3;

interface Question {
  q: keyof QuizAnswers;
  title: string;
  subtitle: string;
  A: { emoji: string; text: string; accent: string };
  B: { emoji: string; text: string; accent: string };
}

const QUESTIONS: Question[] = [
  {
    q: 'q1',
    title: '你更喜欢...',
    subtitle: '选择你理想中的旅行方式',
    A: {
      emoji: '🏖️',
      text: '海滩躺平度假',
      accent: 'from-amber-400 via-orange-400 to-rose-400',
    },
    B: {
      emoji: '🏙️',
      text: '城市暴走探索',
      accent: 'from-sky-500 via-blue-500 to-indigo-500',
    },
  },
  {
    q: 'q2',
    title: '关于预算...',
    subtitle: '你的钱包准备好了吗？',
    A: {
      emoji: '💰',
      text: '精打细算穷游',
      accent: 'from-emerald-400 via-teal-400 to-cyan-400',
    },
    B: {
      emoji: '💎',
      text: '不太计较享受',
      accent: 'from-violet-400 via-purple-400 to-fuchsia-400',
    },
  },
  {
    q: 'q3',
    title: '想玩多久...',
    subtitle: '假期长短决定目的地',
    A: {
      emoji: '🌿',
      text: '轻松 3-5 天短假',
      accent: 'from-lime-400 via-green-400 to-emerald-400',
    },
    B: {
      emoji: '✈️',
      text: '深度 10+ 天远行',
      accent: 'from-indigo-400 via-blue-500 to-sky-500',
    },
  },
];

function QuizCard({
  option,
  onClick,
  selected,
  disabled,
}: {
  option: { emoji: string; text: string; accent: string };
  onClick: () => void;
  selected: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative w-full p-8 sm:p-10 rounded-3xl text-left overflow-hidden transition-all duration-500',
        'border-2',
        selected
          ? 'border-[#F97316] shadow-2xl shadow-[#F97316]/20 scale-[1.02]'
          : 'border-slate-100 hover:border-slate-300 hover:shadow-xl',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-300',
          option.accent,
          selected ? 'opacity-20' : 'group-hover:opacity-15'
        )}
      />
      <div className="relative flex items-start gap-6">
        <div
          className={cn(
            'text-6xl sm:text-7xl flex-shrink-0 transition-transform duration-300',
            'group-hover:scale-110 group-hover:-rotate-3'
          )}
        >
          {option.emoji}
        </div>
        <div className="flex-1 pt-2">
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0C4A6E] leading-tight mb-2">
            {option.text}
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500 mt-3">
            <span>点击选择</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        {selected && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

function MatchRing({ percentage, size = 140 }: { percentage: number; size?: number }) {
  const circumference = 2 * Math.PI * ((size / 2) - 12);
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size / 2) - 12}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size / 2) - 12}
          fill="none"
          stroke="url(#matchGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        <defs>
          <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div
            className="font-bold tabular-nums text-[#F97316]"
            style={{ fontSize: size * 0.22, fontFamily: "'Fraunces', serif" }}
          >
            {percentage}%
          </div>
          <div className="text-xs text-slate-400 font-medium">匹配度</div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  result, rank,
}: { result: QuizResult; rank: 1 | 2 | 3 }) {
  const isTop = rank === 1;
  const navigate = useNavigate();

  const rankInfo = {
    1: { badge: '🥇', ringSize: 150, scale: 'scale-100' },
    2: { badge: '🥈', ringSize: 120, scale: 'sm:scale-95' },
    3: { badge: '🥉', ringSize: 120, scale: 'sm:scale-95' },
  }[rank];

  return (
    <div
      className={cn(
        'relative w-full rounded-3xl overflow-hidden transition-all duration-500',
        'bg-white shadow-xl hover:shadow-2xl hover:-translate-y-1',
        'border border-slate-100',
        rankInfo.scale
      )}
    >
      <div className="absolute top-4 left-4 z-10 text-4xl animate-bounce">
        {rankInfo.badge}
      </div>

      <button
        onClick={() => navigate(`/destination/${result.destination.id}`)}
        className="w-full block text-left"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={result.destination.coverImage}
            alt={result.destination.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3
              className={cn(
                'font-bold leading-tight tracking-tight',
                isTop ? 'text-3xl' : 'text-2xl'
              )}
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {result.destination.name}
            </h3>
            <div className="text-sm text-white/80 mt-1">
              {result.destination.country}
            </div>
          </div>
        </div>
      </button>

      <div className="p-6 flex flex-col items-center">
        <MatchRing percentage={result.percentage} size={rankInfo.ringSize} />
        <p className="mt-4 text-sm text-slate-500 text-center leading-relaxed">
          {result.destination.tagline}
        </p>
      </div>
    </div>
  );
}

export default function Quiz() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const currentQuestion = QUESTIONS[step - 1];
  const progress = (step / QUESTIONS.length) * 100;

  const results = useMemo((): QuizResult[] => {
    if (!showResults) return [];
    return computeQuizRecommendations(destinations, answers as QuizAnswers);
  }, [showResults, answers]);

  const handleAnswer = (option: 'A' | 'B') => {
    const newAnswers = { ...answers, [currentQuestion.q]: option } as QuizAnswers;
    setAnswers(newAnswers);

    if (step < 3) {
      setTimeout(() => setStep((step + 1) as Step), 400);
    } else {
      setTimeout(() => setShowResults(true), 400);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF3C7]/20 via-white to-[#E0F2FE]/20 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="sticky top-16 lg:top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => {
                  if (showResults) {
                    handleReset();
                  } else if (step > 1) {
                    setStep((step - 1) as Step);
                  } else {
                    navigate('/');
                  }
                }}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0C4A6E] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {showResults ? '回到题目' : step > 1 ? '上一题' : '返回首页'}
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F97316]" />
                <span className="text-sm font-semibold text-[#0C4A6E]">
                  快速推荐
                </span>
              </div>
            </div>
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${showResults ? 100 : progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-400 text-right font-medium">
              {showResults ? '结果已生成' : `第 ${step} / ${QUESTIONS.length} 题`}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
          {!showResults ? (
            <div
              key={step}
              className="animate-fade-up"
            >
              <div className="text-center mb-10 lg:mb-14">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold mb-4">
                  问题 {step} / {QUESTIONS.length}
                </div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0C4A6E] mb-3 tracking-tight"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {currentQuestion.title}
                </h2>
                <p className="text-slate-500 text-lg">
                  {currentQuestion.subtitle}
                </p>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <QuizCard
                  option={currentQuestion.A}
                  onClick={() => handleAnswer('A')}
                  selected={answers[currentQuestion.q] === 'A'}
                />
                <QuizCard
                  option={currentQuestion.B}
                  onClick={() => handleAnswer('B')}
                  selected={answers[currentQuestion.q] === 'B'}
                />
              </div>
            </div>
          ) : (
            <div className="animate-fade-up">
              <div className="text-center mb-10 lg:mb-14">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-bold mb-5 shadow-lg shadow-[#F97316]/25">
                  <Trophy className="w-5 h-5" />
                  推荐完成！
                </div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0C4A6E] mb-3 tracking-tight"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  为你找到 Top 3 目的地！
                </h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">
                  根据你的偏好，我们为你精选了这些最适合的旅行灵感 ✨
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch mb-12">
                <div className="sm:order-1 sm:self-end">
                  {results[1] && <ResultCard result={results[1]} rank={2} />}
                </div>
                <div className="sm:order-2 sm:-mt-4 sm:mb-4">
                  {results[0] && <ResultCard result={results[0]} rank={1} />}
                </div>
                <div className="sm:order-3 sm:self-end">
                  {results[2] && <ResultCard result={results[2]} rank={3} />}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-[#0C4A6E]/10 text-[#0C4A6E] font-bold text-base hover:border-[#0C4A6E]/30 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  重新测试
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold text-base hover:shadow-xl hover:shadow-[#F97316]/25 transition-all duration-200 hover:scale-105"
                >
                  <Home className="w-5 h-5" />
                  回到首页
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
