import type { QuizQuestion } from '@/lib/db/schema';

export const quizQuestions: QuizQuestion[] = [
  // ============================================================
  // MODULE 1: Introduction (Chapter 1) -- marl-1.1 through marl-1.4
  // ============================================================

  // --- Lesson marl-1.1: Multi-Agent Systems ---
  {
    id: 'quiz-marl-1.1-1',
    lessonId: 'marl-1.1',
    question: 'What are the three basic components of a multi-agent system?',
    type: 'multiple-choice',
    options: [
      'Environment, agents, and goals',
      'States, actions, and rewards',
      'Policies, value functions, and episodes',
      'Observations, transitions, and terminal states',
    ],
    correctAnswer: 'Environment, agents, and goals',
    explanation:
      'A multi-agent system consists of an environment (physical or virtual world), multiple decision-making agents that interact in the environment, and their goals that direct the agents\' actions.',
    relatedCardIds: ['rc-marl-1.1-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-1.1-2',
    lessonId: 'marl-1.1',
    question:
      'In multi-agent environments, individual agents always have a complete and perfect view of the entire environment state.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'Multi-agent environments are often characterized by the fact that agents only have a limited and imperfect view of the environment. Individual agents may only observe partial information, and different agents may receive different observations.',
    relatedCardIds: ['rc-marl-1.1-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-1.1-3',
    lessonId: 'marl-1.1',
    question:
      'In MARL, goals are defined by _____ functions that specify scalar signals agents receive after taking certain actions in certain states.',
    type: 'fill-blank',
    correctAnswer: 'reward',
    explanation:
      'In MARL, goals are defined by reward functions that specify scalar reward signals. These signals tell agents how well they are performing and guide the learning of optimal policies.',
    relatedCardIds: ['rc-marl-1.1-3'],
    order: 3,
  },

  // --- Lesson marl-1.2: Multi-Agent Reinforcement Learning ---
  {
    id: 'quiz-marl-1.2-1',
    lessonId: 'marl-1.2',
    question:
      'What is the term for the combined actions of all agents at a given time step in MARL?',
    type: 'multiple-choice',
    options: [
      'Combined action',
      'Joint action',
      'Collective move',
      'Action profile',
    ],
    correctAnswer: 'Joint action',
    explanation:
      'In MARL, individual agent actions together form the joint action. The joint action changes the state of the environment according to its dynamics, and agents receive individual rewards and observations as a result.',
    relatedCardIds: ['rc-marl-1.2-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-1.2-2',
    lessonId: 'marl-1.2',
    question:
      'One use case for MARL is to decompose a large, intractable decision problem into smaller, more tractable decision problems by introducing multiple agents.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'MARL can decompose a single large decision problem into smaller ones. For example, in level-based foraging with three robots, a central agent would face 216 possible joint actions, but three independent agents each face only six actions.',
    relatedCardIds: ['rc-marl-1.2-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-1.2-3',
    lessonId: 'marl-1.2',
    question:
      'A complete run of the MARL training loop from the initial state to the terminal state is called an _____.',
    type: 'fill-blank',
    correctAnswer: 'episode',
    explanation:
      'An episode is a complete run of the MARL loop from the initial state to the terminal state. Data from multiple independent episodes is used to continually improve the agents\' policies.',
    relatedCardIds: ['rc-marl-1.2-3'],
    order: 3,
  },

  // --- Lesson marl-1.3: Application Examples ---
  {
    id: 'quiz-marl-1.3-1',
    lessonId: 'marl-1.3',
    question:
      'In the autonomous driving application of MARL, what type of reward scenario is described?',
    type: 'multiple-choice',
    options: [
      'Zero-sum reward',
      'Common reward',
      'General-sum (mixed-motive) reward',
      'Constant reward',
    ],
    correctAnswer: 'General-sum (mixed-motive) reward',
    explanation:
      'Autonomous driving is described as a mixed-motive (general-sum) scenario because agents collaborate to avoid collisions but are also self-interested in minimizing their own driving times and driving smoothly.',
    relatedCardIds: ['rc-marl-1.3-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-1.3-2',
    lessonId: 'marl-1.3',
    question:
      'In fully competitive two-agent games, one agent\'s reward is the negative of the other agent\'s reward. This property is called zero-sum reward.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'In zero-sum games with two agents, one agent\'s reward function is the negative of the other\'s. For example, in chess, the winner receives +1 and the loser receives -1.',
    relatedCardIds: ['rc-marl-1.3-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-1.3-3',
    lessonId: 'marl-1.3',
    question:
      'When all agents in a multi-agent system receive identical rewards, this is called _____ reward.',
    type: 'fill-blank',
    correctAnswer: 'common',
    explanation:
      'Common reward (also called shared reward) is when all agents receive identical rewards. This is an important special case in MARL, such as in cooperative warehouse management where all robots receive a reward when any order is completed.',
    relatedCardIds: ['rc-marl-1.3-3'],
    order: 3,
  },

  // --- Lesson marl-1.4: Challenges and Agendas of MARL ---
  {
    id: 'quiz-marl-1.4-1',
    lessonId: 'marl-1.4',
    question:
      'Which MARL challenge refers to the difficulty of determining whose action among multiple agents contributed to a received reward?',
    type: 'multiple-choice',
    options: [
      'Non-stationarity',
      'Equilibrium selection',
      'Multi-agent credit assignment',
      'Scaling in number of agents',
    ],
    correctAnswer: 'Multi-agent credit assignment',
    explanation:
      'Multi-agent credit assignment is the problem of determining whose action contributed to a received reward. This is compounded by temporal credit assignment, which determines which past actions contributed to a reward.',
    relatedCardIds: ['rc-marl-1.4-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-1.4-2',
    lessonId: 'marl-1.4',
    question:
      'The descriptive agenda of MARL focuses on optimizing the decision policies of agents toward defined criteria.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'The descriptive agenda uses MARL to study the behaviors of natural agents (such as humans and animals) when learning in a population. The computational agenda is the one focused on optimizing decision policies toward defined criteria.',
    relatedCardIds: ['rc-marl-1.4-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-1.4-3',
    lessonId: 'marl-1.4',
    question:
      'The _____ problem in MARL arises because each agent adapts to the changing policies of other agents, which in turn also adapt, potentially causing cyclic and unstable learning dynamics.',
    type: 'fill-blank',
    correctAnswer: 'non-stationarity',
    explanation:
      'Non-stationarity caused by learning agents is a central challenge of MARL. The continually changing policies create a moving target problem where agents chase each other\'s adaptations, potentially causing cyclic and unstable dynamics.',
    relatedCardIds: ['rc-marl-1.4-3'],
    order: 3,
  },

  // ============================================================
  // MODULE 2: Reinforcement Learning (Chapter 2) -- marl-2.1 through marl-2.7
  // ============================================================

  // --- Lesson marl-2.1: General Definition of RL ---
  {
    id: 'quiz-marl-2.1-1',
    lessonId: 'marl-2.1',
    question:
      'Which of the following best describes reinforcement learning?',
    type: 'multiple-choice',
    options: [
      'Learning from labeled input-output pairs to approximate an unknown function',
      'Learning solutions for sequential decision processes via repeated interaction with an environment',
      'Identifying useful structure within unlabeled data',
      'Optimizing a loss function over a training dataset using gradient descent',
    ],
    correctAnswer:
      'Learning solutions for sequential decision processes via repeated interaction with an environment',
    explanation:
      'RL algorithms learn solutions for sequential decision processes via repeated interaction with an environment. This distinguishes RL from supervised learning (labeled data) and unsupervised learning (finding structure in unlabeled data).',
    relatedCardIds: ['rc-marl-2.1-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-2.1-2',
    lessonId: 'marl-2.1',
    question:
      'RL is a type of supervised learning because the reward signals tell the agent which action to take in each state.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'RL is not supervised learning because reward signals do not tell the agent which action to take. Some actions may give lower immediate reward but lead to states with higher future rewards. Rewards act as a proxy, not a supervision signal.',
    relatedCardIds: ['rc-marl-2.1-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-2.1-3',
    lessonId: 'marl-2.1',
    question:
      'The central problem in RL learning called the _____-exploitation dilemma is how to balance exploring outcomes of different actions versus sticking with actions believed to be best.',
    type: 'fill-blank',
    correctAnswer: 'exploration',
    explanation:
      'The exploration-exploitation dilemma is a central problem in RL. Exploration may discover better actions but can accrue low rewards, while exploitation achieves certain returns but may miss the optimal actions.',
    relatedCardIds: ['rc-marl-2.1-3'],
    order: 3,
  },

  // --- Lesson marl-2.2: Markov Decision Processes ---
  {
    id: 'quiz-marl-2.2-1',
    lessonId: 'marl-2.2',
    question:
      'Which of the following is NOT a component of a finite Markov decision process (MDP)?',
    type: 'multiple-choice',
    options: [
      'Finite set of states S',
      'Reward function R',
      'Observation function O',
      'State transition probability function T',
    ],
    correctAnswer: 'Observation function O',
    explanation:
      'A finite MDP consists of a finite set of states S, finite set of actions A, reward function R, state transition probability function T, and initial state distribution mu. Observation functions are part of POMDPs, not standard MDPs.',
    relatedCardIds: ['rc-marl-2.2-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-2.2-2',
    lessonId: 'marl-2.2',
    question:
      'The Markov property states that the future state and reward depend on the entire history of past states and actions.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'The Markov property states the opposite: the future state and reward are conditionally independent of past states and actions, given only the current state and action. The current state provides sufficient information for optimal decision making.',
    relatedCardIds: ['rc-marl-2.2-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-2.2-3',
    lessonId: 'marl-2.2',
    question:
      'The multi-armed _____ problem is a special case of the MDP in which each episode terminates after one time step and there is only a single state.',
    type: 'fill-blank',
    correctAnswer: 'bandit',
    explanation:
      'The multi-armed bandit problem is an MDP special case with a single state and episodes of length one. Each action produces a reward from an unknown distribution, making it a fundamental model for studying the exploration-exploitation dilemma.',
    relatedCardIds: ['rc-marl-2.2-3'],
    order: 3,
  },

  // --- Lesson marl-2.3: Expected Discounted Returns and Optimal Policies ---
  {
    id: 'quiz-marl-2.3-1',
    lessonId: 'marl-2.3',
    question:
      'What is the purpose of the discount factor gamma in reinforcement learning?',
    type: 'multiple-choice',
    options: [
      'To ensure the agent always selects the action with the highest immediate reward',
      'To guarantee finite returns and weight future rewards relative to immediate ones',
      'To determine the number of episodes in training',
      'To specify the probability of selecting a random action',
    ],
    correctAnswer:
      'To guarantee finite returns and weight future rewards relative to immediate ones',
    explanation:
      'The discount factor gamma ensures finite returns in non-terminating MDPs and controls how much the agent values future rewards. A gamma close to 0 makes the agent myopic, while gamma close to 1 makes it farsighted.',
    relatedCardIds: ['rc-marl-2.3-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-2.3-2',
    lessonId: 'marl-2.3',
    question:
      'While the optimal value function of an MDP is always unique, there may be multiple optimal policies that achieve this same optimal value function.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'The optimal value function is always unique, but if multiple actions share the same maximum value in a state, the optimal policy can assign arbitrary probabilities to these actions. However, there always exist deterministic optimal policies.',
    relatedCardIds: ['rc-marl-2.3-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-2.3-3',
    lessonId: 'marl-2.3',
    question:
      'Once the MDP reaches an _____ state, it will forever remain in that state and the agent will not accrue any more rewards.',
    type: 'fill-blank',
    correctAnswer: 'absorbing',
    explanation:
      'An absorbing state is a convention for terminal or maximum-time-step states. Any actions in this state transition the MDP into the same state with probability 1 and give a reward of 0, ensuring discounted returns work for both terminating and non-terminating MDPs.',
    relatedCardIds: ['rc-marl-2.3-3'],
    order: 3,
  },

  // --- Lesson marl-2.4: Value Functions and Bellman Equation ---
  {
    id: 'quiz-marl-2.4-1',
    lessonId: 'marl-2.4',
    question:
      'What does the state-value function V^pi(s) represent?',
    type: 'multiple-choice',
    options: [
      'The immediate reward received in state s',
      'The expected return when starting in state s and following policy pi',
      'The probability of transitioning to state s',
      'The maximum possible reward achievable in the entire MDP',
    ],
    correctAnswer:
      'The expected return when starting in state s and following policy pi',
    explanation:
      'The state-value function V^pi(s) gives the expected return when starting in state s and following policy pi to select actions. It quantifies how "good" it is to be in state s under policy pi.',
    relatedCardIds: ['rc-marl-2.4-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-2.4-2',
    lessonId: 'marl-2.4',
    question:
      'The Bellman optimality equations define a system of linear equations that can be solved using standard methods such as Gauss elimination.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'The Bellman optimality equations define a system of non-linear equations due to the max operator. It is the regular Bellman equation for V^pi (for a fixed policy) that defines a system of linear equations.',
    relatedCardIds: ['rc-marl-2.4-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-2.4-3',
    lessonId: 'marl-2.4',
    question:
      'The action-value function Q^pi(s, a) gives the expected return when selecting action a in state s and then following policy _____ to select actions subsequently.',
    type: 'fill-blank',
    correctAnswer: 'pi',
    explanation:
      'Q^pi(s, a) gives the expected return for taking action a in state s and then following policy pi for all subsequent actions. Once Q* is known, the optimal policy simply selects the action with maximum Q* value in each state.',
    relatedCardIds: ['rc-marl-2.4-3'],
    order: 3,
  },

  // --- Lesson marl-2.5: Dynamic Programming ---
  {
    id: 'quiz-marl-2.5-1',
    lessonId: 'marl-2.5',
    question:
      'What are the two tasks that policy iteration alternates between?',
    type: 'multiple-choice',
    options: [
      'Exploration and exploitation',
      'Policy evaluation and policy improvement',
      'Value estimation and reward shaping',
      'State sampling and action selection',
    ],
    correctAnswer: 'Policy evaluation and policy improvement',
    explanation:
      'Policy iteration alternates between policy evaluation (computing the value function V^pi for the current policy) and policy improvement (making the policy greedy with respect to V^pi). This converges to the optimal policy.',
    relatedCardIds: ['rc-marl-2.5-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-2.5-2',
    lessonId: 'marl-2.5',
    question:
      'Dynamic programming algorithms require complete knowledge of the MDP model, including the reward function R and state transition probabilities T.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'DP algorithms use the Bellman equations as operators and require complete knowledge of R and T to perform the computations. This is in contrast to temporal-difference learning, which learns from sampled experiences.',
    relatedCardIds: ['rc-marl-2.5-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-2.5-3',
    lessonId: 'marl-2.5',
    question:
      '_____ iteration is a DP algorithm that combines one sweep of iterative policy evaluation and policy improvement into a single update using the Bellman optimality equation.',
    type: 'fill-blank',
    correctAnswer: 'Value',
    explanation:
      'Value iteration uses the Bellman optimality equation as a single update operator, combining policy evaluation and improvement. It converges to the optimal value function V* because the Bellman optimality operator is a gamma-contraction mapping.',
    relatedCardIds: ['rc-marl-2.5-3'],
    order: 3,
  },

  // --- Lesson marl-2.6: Temporal-Difference Learning ---
  {
    id: 'quiz-marl-2.6-1',
    lessonId: 'marl-2.6',
    question:
      'What is the key difference between Q-learning and Sarsa?',
    type: 'multiple-choice',
    options: [
      'Q-learning uses a value function while Sarsa uses a policy function',
      'Q-learning is on-policy while Sarsa is off-policy',
      'Q-learning uses the Bellman optimality equation (max over actions) while Sarsa uses the Bellman equation for Q^pi (samples next action from policy)',
      'Q-learning can only work with discrete actions while Sarsa works with continuous actions',
    ],
    correctAnswer:
      'Q-learning uses the Bellman optimality equation (max over actions) while Sarsa uses the Bellman equation for Q^pi (samples next action from policy)',
    explanation:
      'Q-learning constructs its update target using max over next actions (Bellman optimality equation), making it off-policy. Sarsa uses the actually sampled next action from the policy (Bellman equation for Q^pi), making it on-policy.',
    relatedCardIds: ['rc-marl-2.6-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-2.6-2',
    lessonId: 'marl-2.6',
    question:
      'Q-learning requires the policy used to interact with the environment to be gradually made closer to the optimal policy in order to converge.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'Q-learning is an off-policy algorithm and does not require the interaction policy to approach the optimal policy. It may use any policy for interaction, as long as convergence conditions (trying all state-action pairs infinitely often) are met. Sarsa is the on-policy algorithm that requires this.',
    relatedCardIds: ['rc-marl-2.6-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-2.6-3',
    lessonId: 'marl-2.6',
    question:
      'An _____-greedy policy chooses the greedy action with probability 1 minus epsilon, and with probability epsilon chooses a random action.',
    type: 'fill-blank',
    correctAnswer: 'epsilon',
    explanation:
      'The epsilon-greedy policy balances exploitation (choosing the best-known action) with exploration (random action selection). By gradually reducing epsilon to 0, the policy converges toward the optimal greedy policy.',
    relatedCardIds: ['rc-marl-2.6-3'],
    order: 3,
  },

  // --- Lesson marl-2.7: Evaluation with Learning Curves ---
  {
    id: 'quiz-marl-2.7-1',
    lessonId: 'marl-2.7',
    question:
      'Why are learning curves typically plotted against cumulative training time steps rather than number of completed episodes?',
    type: 'multiple-choice',
    options: [
      'Because time steps are easier to count than episodes',
      'Because episodes have no clear definition in MDPs',
      'Because using episodes on the x-axis can skew comparisons if algorithms have different episode lengths',
      'Because the discount factor applies to time steps, not episodes',
    ],
    correctAnswer:
      'Because using episodes on the x-axis can skew comparisons if algorithms have different episode lengths',
    explanation:
      'Using episodes on the x-axis can be misleading because one algorithm may use many more time steps per episode than another. Cumulative time steps provide a fairer comparison of the actual amount of interaction and learning updates performed.',
    relatedCardIds: ['rc-marl-2.7-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-2.7-2',
    lessonId: 'marl-2.7',
    question:
      'Two RL problems that differ only in their discount factor but are otherwise identical will always have the same optimal policy.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'Different discount factors can lead to different optimal policies. In the Mars Rover example, gamma=0.95 leads to choosing action left (V*=4.1) while gamma=0.5 leads to choosing action right (V*=0). The discount factor is part of the learning problem specification.',
    relatedCardIds: ['rc-marl-2.7-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-2.7-3',
    lessonId: 'marl-2.7',
    question:
      'The term "evaluation return" means the returns are for the _____ policy with respect to the learned action values after T learning time steps.',
    type: 'fill-blank',
    correctAnswer: 'greedy',
    explanation:
      'Evaluation returns use the greedy policy extracted from the learned action values. This answers the question: if we stop learning and use the best policy we have learned so far, what expected returns can we achieve?',
    relatedCardIds: ['rc-marl-2.7-3'],
    order: 3,
  },

  // ============================================================
  // MODULE 3: Games: Models of Multi-Agent Interaction (Chapter 3) -- marl-3.1 through marl-3.6
  // ============================================================

  // --- Lesson marl-3.1: Normal-Form Games ---
  {
    id: 'quiz-marl-3.1-1',
    lessonId: 'marl-3.1',
    question:
      'In a zero-sum normal-form game with two agents, what is the relationship between the agents\' reward functions?',
    type: 'multiple-choice',
    options: [
      'Both agents always receive the same reward',
      'One agent\'s reward function is the negative of the other\'s',
      'The rewards are independent of each other',
      'Both agents always receive positive rewards',
    ],
    correctAnswer:
      'One agent\'s reward function is the negative of the other\'s',
    explanation:
      'In zero-sum games with two agents, R_i = -R_j. The sum of the agents\' rewards is always 0 for every joint action. This means one agent\'s gain is exactly the other agent\'s loss.',
    relatedCardIds: ['rc-marl-3.1-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-3.1-2',
    lessonId: 'marl-3.1',
    question:
      'In the Prisoner\'s Dilemma, the dominant action for each agent is to cooperate (C).',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'In the Prisoner\'s Dilemma, the dominant action for each agent is to defect (D), not cooperate. Defecting always achieves higher rewards compared to cooperating regardless of the other agent\'s action, even though mutual cooperation would give both agents a higher reward than mutual defection.',
    relatedCardIds: ['rc-marl-3.1-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-3.1-3',
    lessonId: 'marl-3.1',
    question:
      'Normal-form games with two agents are also referred to as _____ games because the reward function can be represented as a matrix.',
    type: 'fill-blank',
    correctAnswer: 'matrix',
    explanation:
      'Two-agent normal-form games are called matrix games because the rewards can be displayed in a matrix where one agent picks the row and the other picks the column, with each cell showing the reward pair.',
    relatedCardIds: ['rc-marl-3.1-3'],
    order: 3,
  },

  // --- Lesson marl-3.2: Repeated Normal-Form Games ---
  {
    id: 'quiz-marl-3.2-1',
    lessonId: 'marl-3.2',
    question:
      'What is the Tit-for-Tat policy in the repeated Prisoner\'s Dilemma?',
    type: 'multiple-choice',
    options: [
      'Always defect regardless of the other agent\'s action',
      'Cooperate if the other agent cooperated in the previous step, and defect if the other agent defected',
      'Randomly choose between cooperate and defect each step',
      'Cooperate for the first half of the game and defect for the second half',
    ],
    correctAnswer:
      'Cooperate if the other agent cooperated in the previous step, and defect if the other agent defected',
    explanation:
      'Tit-for-Tat is a famous policy for repeated Prisoner\'s Dilemma that conditions on the most recent action of the other agent, copying their previous move. It cooperates initially and then mirrors the opponent.',
    relatedCardIds: ['rc-marl-3.2-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-3.2-2',
    lessonId: 'marl-3.2',
    question:
      'A finitely repeated game is always equivalent to the same game with infinite repetitions.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'Finitely repeated games are not equivalent to infinitely repeated games. In finite games, there can be "end-game" effects where agents choose different actions near the end compared to earlier in the game, since they know the game will terminate.',
    relatedCardIds: ['rc-marl-3.2-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-3.2-3',
    lessonId: 'marl-3.2',
    question:
      'In a repeated normal-form game, the policy of each agent is conditioned on the joint-action _____.',
    type: 'fill-blank',
    correctAnswer: 'history',
    explanation:
      'In repeated normal-form games, each agent\'s policy is conditioned on the joint-action history h_t = (a^0, ..., a^{t-1}), which contains all joint actions before the current time step. This allows agents to adapt based on past interactions.',
    relatedCardIds: ['rc-marl-3.2-3'],
    order: 3,
  },

  // --- Lesson marl-3.3: Stochastic Games ---
  {
    id: 'quiz-marl-3.3-1',
    lessonId: 'marl-3.3',
    question:
      'What is the key feature that distinguishes stochastic games from repeated normal-form games?',
    type: 'multiple-choice',
    options: [
      'Stochastic games allow more than two agents',
      'Stochastic games define environment states that change over time based on agents\' actions',
      'Stochastic games always use continuous action spaces',
      'Stochastic games do not have terminal states',
    ],
    correctAnswer:
      'Stochastic games define environment states that change over time based on agents\' actions',
    explanation:
      'While repeated normal-form games lack an evolving environment state, stochastic games define states that evolve over time based on agents\' joint actions and probabilistic state transitions. Repeated normal-form games are a special case with only one state.',
    relatedCardIds: ['rc-marl-3.3-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-3.3-2',
    lessonId: 'marl-3.3',
    question:
      'Stochastic games include MDPs as a special case in which there is only a single agent.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'Stochastic games generalize MDPs to the multi-agent setting. An MDP is a stochastic game with only one agent, just as a repeated normal-form game is a stochastic game with only one state.',
    relatedCardIds: ['rc-marl-3.3-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-3.3-3',
    lessonId: 'marl-3.3',
    question:
      'Stochastic games are also sometimes called _____ games because they share the Markov property with MDPs.',
    type: 'fill-blank',
    correctAnswer: 'Markov',
    explanation:
      'Stochastic games are also called Markov games because, like MDPs, the probability of the next state and reward is conditionally independent of past states and joint actions given the current state and joint action.',
    relatedCardIds: ['rc-marl-3.3-3'],
    order: 3,
  },

  // --- Lesson marl-3.4: Partially Observable Stochastic Games ---
  {
    id: 'quiz-marl-3.4-1',
    lessonId: 'marl-3.4',
    question:
      'What additional component does a POSG define compared to a stochastic game?',
    type: 'multiple-choice',
    options: [
      'A communication protocol for agents',
      'Observation functions that generate individual observations for each agent',
      'A discount factor for returns',
      'A central coordinator that assigns actions to agents',
    ],
    correctAnswer:
      'Observation functions that generate individual observations for each agent',
    explanation:
      'A POSG extends a stochastic game with observation sets O_i and observation functions O_i for each agent. Instead of directly observing the full state, agents receive partial/noisy observations through these functions.',
    relatedCardIds: ['rc-marl-3.4-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-3.4-2',
    lessonId: 'marl-3.4',
    question:
      'POSGs with common rewards, where all agents share the same reward function, are also known as Decentralized POMDPs (Dec-POMDPs).',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'Common-reward POSGs are called Decentralized POMDPs (Dec-POMDPs) and have been widely studied in multi-agent planning research. They represent fully cooperative partially observable scenarios.',
    relatedCardIds: ['rc-marl-3.4-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-3.4-3',
    lessonId: 'marl-3.4',
    question:
      'A _____ state is a probability distribution over possible environment states that serves as a sufficient statistic for choosing optimal actions under partial observability.',
    type: 'fill-blank',
    correctAnswer: 'belief',
    explanation:
      'A belief state represents the agent\'s probability distribution over possible environment states. It is updated using Bayesian filtering and carries enough information for optimal decision making, though computing exact belief states is intractable for complex environments.',
    relatedCardIds: ['rc-marl-3.4-3'],
    order: 3,
  },

  // --- Lesson marl-3.5: Modeling Communication ---
  {
    id: 'quiz-marl-3.5-1',
    lessonId: 'marl-3.5',
    question:
      'How is communication typically modeled in stochastic games and POSGs?',
    type: 'multiple-choice',
    options: [
      'Through a separate communication channel that is independent of the game model',
      'By including communication actions that can be observed by other agents but do not affect the environment state',
      'By allowing agents to directly modify each other\'s policies',
      'Through a shared memory buffer that all agents can read and write to',
    ],
    correctAnswer:
      'By including communication actions that can be observed by other agents but do not affect the environment state',
    explanation:
      'Communication is modeled by splitting agent actions into environment actions (affecting state) and communication actions (messages). Communication actions can be observed by other agents but do not affect the environment state transitions.',
    relatedCardIds: ['rc-marl-3.5-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-3.5-2',
    lessonId: 'marl-3.5',
    question:
      'In RL, agents typically know the meaning of communication actions from the start and do not need to learn what messages mean.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'In RL, the standard assumption is that agents do not know the meaning of any actions including communication actions. Agents must learn through trial and error what messages mean and how to interpret messages from other agents, potentially developing a shared language.',
    relatedCardIds: ['rc-marl-3.5-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-3.5-3',
    lessonId: 'marl-3.5',
    question:
      'Communications in stochastic games are _____ in that they last only for a single time step, though agents can remember past messages through their history.',
    type: 'fill-blank',
    correctAnswer: 'ephemeral',
    explanation:
      'Communication messages are ephemeral, meaning they only exist for one time step. However, since agents have access to the state-action history that includes past joint actions, they can in principle remember and use past messages.',
    relatedCardIds: ['rc-marl-3.5-3'],
    order: 3,
  },

  // --- Lesson marl-3.6: Knowledge Assumptions in Games ---
  {
    id: 'quiz-marl-3.6-1',
    lessonId: 'marl-3.6',
    question:
      'In the standard MARL assumption about knowledge, what do agents typically know about the game?',
    type: 'multiple-choice',
    options: [
      'Agents know all components of the game including other agents\' reward functions',
      'Agents know only the state transition function but not the reward functions',
      'Agents typically do not know the reward functions, state transition function, or observation functions',
      'Agents know their own reward function but nothing else about the game',
    ],
    correctAnswer:
      'Agents typically do not know the reward functions, state transition function, or observation functions',
    explanation:
      'In MARL, the standard assumption is that agents do not know the reward functions of other agents (nor their own), and have no knowledge of the state transition and observation functions. Agents only experience immediate effects through their own rewards and observations.',
    relatedCardIds: ['rc-marl-3.6-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-3.6-2',
    lessonId: 'marl-3.6',
    question:
      'In game theory, a "complete knowledge game" means all agents have knowledge of all components that define the game.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'In game theory, the standard assumption is a complete knowledge game where all agents know all game components including action spaces, reward functions, state transitions, and observation functions of all agents.',
    relatedCardIds: ['rc-marl-3.6-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-3.6-3',
    lessonId: 'marl-3.6',
    question:
      'In game theory, a game in which agents do not have knowledge of the reward functions and transition probabilities is called an _____ information game.',
    type: 'fill-blank',
    correctAnswer: 'incomplete',
    explanation:
      'An incomplete information game is one where agents lack knowledge of key game components such as reward functions and transition probabilities. This is the typical assumption in MARL, where agents learn through interaction rather than from prior knowledge.',
    relatedCardIds: ['rc-marl-3.6-3'],
    order: 3,
  },

  // ============================================================
  // MODULE 4: Solution Concepts for Games (Chapter 4) -- marl-4.1 through marl-4.8
  // ============================================================

  // --- Lesson marl-4.1: Joint Policy and Expected Return ---
  {
    id: 'quiz-marl-4.1-1',
    lessonId: 'marl-4.1',
    question:
      'What defines a MARL problem?',
    type: 'multiple-choice',
    options: [
      'A game model and a learning algorithm',
      'A game model and a solution concept',
      'A set of agents and their reward functions',
      'A state space and an action space',
    ],
    correctAnswer: 'A game model and a solution concept',
    explanation:
      'A MARL problem is defined by the combination of a game model (defining the mechanics of the multi-agent system) and a solution concept (specifying the desired properties of the joint policy to be learned), analogous to how an RL problem combines an MDP with a learning objective.',
    relatedCardIds: ['rc-marl-4.1-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-4.1-2',
    lessonId: 'marl-4.1',
    question:
      'The expected return U_i(pi) for an agent can be equivalently defined using either a history-based enumeration or a recursive Bellman-style computation.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'The book presents two equivalent definitions of expected return. The history-based definition sums returns across all possible full histories weighted by their probabilities. The recursive definition uses interlocked V and Q functions in a Bellman-style recursion.',
    relatedCardIds: ['rc-marl-4.1-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-4.1-3',
    lessonId: 'marl-4.1',
    question:
      'A solution to a game is a _____ policy that consists of one policy for each agent and satisfies certain properties defined by the solution concept.',
    type: 'fill-blank',
    correctAnswer: 'joint',
    explanation:
      'A solution to a game is a joint policy pi = (pi_1, ..., pi_n), one policy per agent, that satisfies requirements defined by the solution concept in terms of expected returns yielded to each agent.',
    relatedCardIds: ['rc-marl-4.1-3'],
    order: 3,
  },

  // --- Lesson marl-4.2: Best Response ---
  {
    id: 'quiz-marl-4.2-1',
    lessonId: 'marl-4.2',
    question:
      'What is a best response for agent i to the policies of other agents pi_{-i}?',
    type: 'multiple-choice',
    options: [
      'A policy that minimizes the expected returns of other agents',
      'A policy that maximizes agent i\'s expected return when played against pi_{-i}',
      'A policy that achieves the same expected return as other agents',
      'A policy that cooperates with all other agents regardless of their policies',
    ],
    correctAnswer:
      'A policy that maximizes agent i\'s expected return when played against pi_{-i}',
    explanation:
      'A best response for agent i to pi_{-i} is a policy pi_i that maximizes i\'s expected return U_i when played against the given policies of all other agents. Best responses form the basis for defining most equilibrium solution concepts.',
    relatedCardIds: ['rc-marl-4.2-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-4.2-2',
    lessonId: 'marl-4.2',
    question:
      'The best response to a given set of opponent policies is always unique -- there is exactly one best-response policy.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'The best response may not be unique. For example, in Rock-Paper-Scissors, if one agent uses a uniform policy, any policy for the other agent is a best response since all yield expected reward of 0. Multiple actions may share the same maximum expected return.',
    relatedCardIds: ['rc-marl-4.2-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-4.2-3',
    lessonId: 'marl-4.2',
    question:
      'The set of best-response policies for agent i is defined as BR_i(pi_{-i}) = arg _____ U_i(pi_i, pi_{-i}).',
    type: 'fill-blank',
    correctAnswer: 'max',
    explanation:
      'The best response set is defined using argmax over the expected return. Agent i selects the policy (or policies) from its policy space that maximize its own expected return given fixed policies of all other agents.',
    relatedCardIds: ['rc-marl-4.2-3'],
    order: 3,
  },

  // --- Lesson marl-4.3: Minimax ---
  {
    id: 'quiz-marl-4.3-1',
    lessonId: 'marl-4.3',
    question:
      'Which statement about minimax solutions in two-agent zero-sum games is correct?',
    type: 'multiple-choice',
    options: [
      'Minimax solutions may yield different game values depending on which solution is found',
      'Minimax solutions only exist in games with continuous action spaces',
      'All minimax solutions yield the same unique game value',
      'A minimax solution always assigns probability 1 to a single action for each agent',
    ],
    correctAnswer:
      'All minimax solutions yield the same unique game value',
    explanation:
      'While more than one minimax solution may exist, all minimax solutions yield the same unique value U_i(pi) for each agent. This uniqueness of the game value is an important property that simplifies learning in zero-sum games.',
    relatedCardIds: ['rc-marl-4.3-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-4.3-2',
    lessonId: 'marl-4.3',
    question:
      'In the non-repeated Rock-Paper-Scissors game, the unique minimax solution is for both agents to choose actions uniformly randomly.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'In Rock-Paper-Scissors, the only minimax solution is for both agents to assign equal probability (1/3) to each action. This gives an expected return of 0 to both agents. Any deviation would allow the opponent to exploit the bias.',
    relatedCardIds: ['rc-marl-4.3-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-4.3-3',
    lessonId: 'marl-4.3',
    question:
      'For non-repeated zero-sum normal-form games, a minimax solution can be computed by solving two _____ programs, one for each agent.',
    type: 'fill-blank',
    correctAnswer: 'linear',
    explanation:
      'Minimax solutions for two-agent zero-sum normal-form games can be computed via linear programming. Each linear program computes one agent\'s policy by minimizing the other agent\'s expected return, and linear programs can be solved in polynomial time.',
    relatedCardIds: ['rc-marl-4.3-3'],
    order: 3,
  },

  // --- Lesson marl-4.4: Nash Equilibrium ---
  {
    id: 'quiz-marl-4.4-1',
    lessonId: 'marl-4.4',
    question:
      'What is the defining property of a Nash equilibrium?',
    type: 'multiple-choice',
    options: [
      'All agents maximize their collective expected return',
      'No agent can improve its expected return by unilaterally changing its policy',
      'All agents use identical policies',
      'The joint policy achieves the maximum possible social welfare',
    ],
    correctAnswer:
      'No agent can improve its expected return by unilaterally changing its policy',
    explanation:
      'In a Nash equilibrium, no agent i can improve its expected return by changing its own policy while the other agents\' policies remain fixed. Each agent\'s policy is a best response to the others, creating a stable outcome.',
    relatedCardIds: ['rc-marl-4.4-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-4.4-2',
    lessonId: 'marl-4.4',
    question:
      'Some games only have probabilistic Nash equilibria and no deterministic Nash equilibria.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'Rock-Paper-Scissors is an example of a game with only a probabilistic Nash equilibrium (uniform random play) and no deterministic Nash equilibrium. This is important because some MARL algorithms cannot represent probabilistic policies.',
    relatedCardIds: ['rc-marl-4.4-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-4.4-3',
    lessonId: 'marl-4.4',
    question:
      'Nash (1950) first proved that every finite normal-form game has at least one Nash _____.',
    type: 'fill-blank',
    correctAnswer: 'equilibrium',
    explanation:
      'Nash\'s celebrated 1950 result guarantees that at least one Nash equilibrium exists in every finite normal-form game. However, the equilibrium may be probabilistic (mixed) rather than deterministic (pure), and a game may have multiple equilibria.',
    relatedCardIds: ['rc-marl-4.4-3'],
    order: 3,
  },

  // --- Lesson marl-4.5: Epsilon-Nash Equilibrium ---
  {
    id: 'quiz-marl-4.5-1',
    lessonId: 'marl-4.5',
    question:
      'Why is the epsilon-Nash equilibrium concept needed?',
    type: 'multiple-choice',
    options: [
      'Because exact Nash equilibria never exist in practice',
      'Because the action probabilities in a Nash equilibrium may be irrational numbers that cannot be exactly represented in computer systems',
      'Because agents always prefer approximate solutions',
      'Because epsilon-Nash equilibria are always unique while Nash equilibria are not',
    ],
    correctAnswer:
      'Because the action probabilities in a Nash equilibrium may be irrational numbers that cannot be exactly represented in computer systems',
    explanation:
      'For games with more than two agents, Nash equilibrium policies may require irrational-valued probabilities. Since computers use finite-precision floating-point, exact representation is impossible. Epsilon-Nash relaxes this to allow near-optimal solutions.',
    relatedCardIds: ['rc-marl-4.5-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-4.5-2',
    lessonId: 'marl-4.5',
    question:
      'An epsilon-Nash equilibrium is always close to an actual Nash equilibrium in terms of the expected returns it produces.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'An epsilon-Nash equilibrium may not be close to any real Nash equilibrium. The expected returns under an epsilon-Nash equilibrium can be arbitrarily far from those of any Nash equilibrium, even when the Nash equilibrium is unique.',
    relatedCardIds: ['rc-marl-4.5-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-4.5-3',
    lessonId: 'marl-4.5',
    question:
      'In an epsilon-Nash equilibrium, no agent can improve its expected returns by more than _____ when deviating from its policy.',
    type: 'fill-blank',
    correctAnswer: 'epsilon',
    explanation:
      'The epsilon-Nash equilibrium relaxes strict Nash by allowing deviations that gain at most epsilon > 0 in expected return. The exact Nash equilibrium corresponds to epsilon = 0.',
    relatedCardIds: ['rc-marl-4.5-3'],
    order: 3,
  },

  // --- Lesson marl-4.6: (Coarse) Correlated Equilibrium ---
  {
    id: 'quiz-marl-4.6-1',
    lessonId: 'marl-4.6',
    question:
      'How does correlated equilibrium generalize Nash equilibrium?',
    type: 'multiple-choice',
    options: [
      'By allowing agents to communicate before choosing actions',
      'By allowing correlation between agent policies through a joint policy over the joint-action space',
      'By requiring that agents always cooperate',
      'By removing the requirement for agents to best-respond',
    ],
    correctAnswer:
      'By allowing correlation between agent policies through a joint policy over the joint-action space',
    explanation:
      'Nash equilibrium requires independent agent policies. Correlated equilibrium allows a joint policy pi_c that assigns probabilities to joint actions, enabling correlation. Nash equilibrium is the special case where pi_c factors into independent policies.',
    relatedCardIds: ['rc-marl-4.6-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-4.6-2',
    lessonId: 'marl-4.6',
    question:
      'In the Chicken game, a correlated equilibrium can achieve higher expected returns for both agents than any of the three Nash equilibria.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'The correlated equilibrium pi_c with equal probability on (L,L), (S,L), and (L,S) gives expected return of 5 to each agent. This exceeds the probabilistic Nash equilibrium return of approximately 4.66 for each agent.',
    relatedCardIds: ['rc-marl-4.6-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-4.6-3',
    lessonId: 'marl-4.6',
    question:
      'A _____ correlated equilibrium is a more general solution concept where each agent must decide before seeing its recommended action whether to follow the joint policy.',
    type: 'fill-blank',
    correctAnswer: 'coarse',
    explanation:
      'In a coarse correlated equilibrium, agents decide upfront whether to follow the joint policy without first seeing their recommended action. This is more general than correlated equilibrium, which requires the no-deviation property to hold even after seeing the recommended action.',
    relatedCardIds: ['rc-marl-4.6-3'],
    order: 3,
  },

  // --- Lesson marl-4.7: Pareto Optimality, Social Welfare, and Fairness ---
  {
    id: 'quiz-marl-4.7-1',
    lessonId: 'marl-4.7',
    question:
      'What does it mean for a joint policy to be Pareto-optimal?',
    type: 'multiple-choice',
    options: [
      'It achieves the maximum total reward across all agents',
      'No other joint policy can improve the return for at least one agent without reducing the return for any other agent',
      'It is the unique Nash equilibrium of the game',
      'All agents receive equal expected returns',
    ],
    correctAnswer:
      'No other joint policy can improve the return for at least one agent without reducing the return for any other agent',
    explanation:
      'A joint policy is Pareto-optimal if no other joint policy exists that makes at least one agent better off without making any agent worse off. It is a refinement criterion, not necessarily an equilibrium.',
    relatedCardIds: ['rc-marl-4.7-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-4.7-2',
    lessonId: 'marl-4.7',
    question:
      'Welfare optimality implies Pareto optimality, but Pareto optimality does not imply welfare optimality.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'If a policy maximizes the sum of all agents\' returns (welfare-optimal), it must also be Pareto-optimal since any improvement for one agent would increase total welfare, contradicting optimality. But Pareto optimality is weaker -- many Pareto-optimal policies may not maximize total welfare.',
    relatedCardIds: ['rc-marl-4.7-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-4.7-3',
    lessonId: 'marl-4.7',
    question:
      'Social _____ of a joint policy pi is defined as the sum of all agents\' expected returns: W(pi) = sum of U_i(pi).',
    type: 'fill-blank',
    correctAnswer: 'welfare',
    explanation:
      'Social welfare W(pi) = sum_i U_i(pi) measures the total expected return across all agents. A welfare-optimal policy maximizes this sum, which also implies Pareto optimality.',
    relatedCardIds: ['rc-marl-4.7-3'],
    order: 3,
  },

  // --- Lesson marl-4.8: No-Regret and Computational Complexity ---
  {
    id: 'quiz-marl-4.8-1',
    lessonId: 'marl-4.8',
    question:
      'Computing a Nash equilibrium in general-sum normal-form games (NASH) belongs to which complexity class?',
    type: 'multiple-choice',
    options: [
      'P (polynomial time)',
      'NP-complete',
      'PPAD-complete',
      'Undecidable',
    ],
    correctAnswer: 'PPAD-complete',
    explanation:
      'Computing a Nash equilibrium in general-sum normal-form games is PPAD-complete, first proven for three or more agents and later for two agents. Since no efficient algorithms are known for PPAD-complete problems, this implies MARL is unlikely to find Nash equilibria in polynomial time for general games.',
    relatedCardIds: ['rc-marl-4.8-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-4.8-2',
    lessonId: 'marl-4.8',
    question:
      'In two-agent zero-sum normal-form games, the empirical distribution of joint actions produced by agents with no external regret converges to the set of minimax solutions.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'No-regret has connections to equilibrium solutions. In two-agent zero-sum normal-form games, no external regret leads to convergence to minimax solutions. In general-sum games, no external regret leads to coarse correlated equilibria, and no internal regret leads to correlated equilibria.',
    relatedCardIds: ['rc-marl-4.8-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-4.8-3',
    lessonId: 'marl-4.8',
    question:
      'An agent has no-_____ if its average regret in the limit of infinitely many episodes is at most zero.',
    type: 'fill-blank',
    correctAnswer: 'regret',
    explanation:
      'No-regret requires that the average regret across episodes approaches zero or below as the number of episodes goes to infinity. Regret measures the gap between actual rewards and the best single action (or policy) the agent could have used against observed opponent behavior.',
    relatedCardIds: ['rc-marl-4.8-3'],
    order: 3,
  },

  // ============================================================
  // MODULE 5: MARL First Steps and Challenges (Chapter 5) -- marl-5.1 through marl-5.7
  // ============================================================

  // --- Lesson marl-5.1: General Learning Process ---
  {
    id: 'quiz-marl-5.1-1',
    lessonId: 'marl-5.1',
    question:
      'What are the four elements of the general learning process in MARL?',
    type: 'multiple-choice',
    options: [
      'States, actions, rewards, and observations',
      'Game model, data, learning algorithm, and learning goal',
      'Agents, environment, policy, and value function',
      'Training, evaluation, deployment, and monitoring',
    ],
    correctAnswer: 'Game model, data, learning algorithm, and learning goal',
    explanation:
      'The general MARL learning process involves: (1) a game model defining the multi-agent environment, (2) data consisting of histories from episodes, (3) a learning algorithm that updates the joint policy, and (4) a learning goal defined by a solution concept.',
    relatedCardIds: ['rc-marl-5.1-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-5.1-2',
    lessonId: 'marl-5.1',
    question:
      'In centralized training with decentralized execution, the learning algorithm may have access to more information (such as all agents\' observations) than the individual agent policies use during execution.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'In centralized training with decentralized execution, the histories in D may contain full histories with all agents\' observations during learning, while the individual agent policies only have access to each agent\'s own local observations during execution.',
    relatedCardIds: ['rc-marl-5.1-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-5.1-3',
    lessonId: 'marl-5.1',
    question:
      'The learning algorithm L takes the collected data D and current joint policy pi, and produces a new joint policy via pi_{z+1} = L(D_z, _____)',
    type: 'fill-blank',
    correctAnswer: 'pi_z',
    explanation:
      'The learning algorithm takes both the collected data and the current joint policy as inputs to produce an updated joint policy. The initial joint policy pi_0 is typically random, and the process iterates to converge toward a solution.',
    relatedCardIds: ['rc-marl-5.1-3'],
    order: 3,
  },

  // --- Lesson marl-5.2: Convergence Types ---
  {
    id: 'quiz-marl-5.2-1',
    lessonId: 'marl-5.2',
    question:
      'Which of the following is a weaker convergence type compared to convergence of the joint policy to a solution?',
    type: 'multiple-choice',
    options: [
      'Convergence of the value function to zero',
      'Convergence of the empirical distribution of joint actions to a solution',
      'Convergence of the policy gradient to zero',
      'Convergence of the learning rate to zero',
    ],
    correctAnswer:
      'Convergence of the empirical distribution of joint actions to a solution',
    explanation:
      'Convergence of the empirical distribution is weaker than direct policy convergence. Some algorithms like fictitious play learn deterministic policies that cannot represent probabilistic equilibria, but their empirical action distributions may converge to the equilibrium.',
    relatedCardIds: ['rc-marl-5.2-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-5.2-2',
    lessonId: 'marl-5.2',
    question:
      'If the expected returns U_i(pi_z) for all agents converge after some finite z, then the joint policy pi_z must satisfy some convergence property such as being a Nash equilibrium.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'Even if the expected returns converge in practice, this does not necessarily establish any relationship to a solution. The joint policy pi_z might not satisfy any of the formal convergence properties described in the theory.',
    relatedCardIds: ['rc-marl-5.2-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-5.2-3',
    lessonId: 'marl-5.2',
    question:
      'The _____ distribution is defined as the frequency of joint actions observed across episodes: the fraction of times each action was taken in each history.',
    type: 'fill-blank',
    correctAnswer: 'empirical',
    explanation:
      'The empirical distribution records the actual frequency of joint actions across episodes. It is equivalent to the averaged joint policy in expectation and is used in weaker convergence criteria when direct policy convergence cannot be established.',
    relatedCardIds: ['rc-marl-5.2-3'],
    order: 3,
  },

  // --- Lesson marl-5.3: Central Learning ---
  {
    id: 'quiz-marl-5.3-1',
    lessonId: 'marl-5.3',
    question:
      'In a common-reward stochastic game, what type of solution does central learning with an optimal single-agent RL algorithm guarantee?',
    type: 'multiple-choice',
    options: [
      'A Nash equilibrium',
      'A minimax solution',
      'A Pareto-optimal correlated equilibrium',
      'A no-regret solution',
    ],
    correctAnswer: 'A Pareto-optimal correlated equilibrium',
    explanation:
      'In common-reward stochastic games, an optimal central policy achieves maximum expected returns in each state for all agents (since they share the same reward). This makes it Pareto-optimal, and since no agent can improve by deviating, it is also a correlated equilibrium.',
    relatedCardIds: ['rc-marl-5.3-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-5.3-2',
    lessonId: 'marl-5.3',
    question:
      'Central Q-learning (CQL) requires the joint reward to be transformed into a single scalar reward.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'Since CQL applies single-agent RL to the joint-action space, it requires transforming the multi-agent joint reward (r_1,...,r_n) into a single scalar reward r. For common-reward games, r = r_i for any i works. For general-sum games, this transformation is less clear.',
    relatedCardIds: ['rc-marl-5.3-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-5.3-3',
    lessonId: 'marl-5.3',
    question:
      'A fundamental limitation of central learning is that the joint-action space grows _____ in the number of agents.',
    type: 'fill-blank',
    correctAnswer: 'exponentially',
    explanation:
      'The joint-action space |A| = |A_1| * ... * |A_n| grows exponentially with the number of agents. For example, three agents with 6 actions each yields 216 joint actions. This makes standard RL algorithms impractical for many agents.',
    relatedCardIds: ['rc-marl-5.3-3'],
    order: 3,
  },

  // --- Lesson marl-5.4: Independent Learning ---
  {
    id: 'quiz-marl-5.4-1',
    lessonId: 'marl-5.4',
    question:
      'In independent learning, what causes the environment to appear non-stationary from the perspective of each agent?',
    type: 'multiple-choice',
    options: [
      'Random initialization of value functions',
      'Changes in the environment\'s reward function over time',
      'The continually changing policies of other agents during learning',
      'The use of epsilon-greedy exploration',
    ],
    correctAnswer:
      'The continually changing policies of other agents during learning',
    explanation:
      'In independent learning, other agents\' policies become part of the effective transition function from each agent\'s perspective. As these policies change during learning, the environment dynamics appear non-stationary, breaking the Markov assumption.',
    relatedCardIds: ['rc-marl-5.4-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-5.4-2',
    lessonId: 'marl-5.4',
    question:
      'Independent Q-learning (IQL) is guaranteed to converge to a Nash equilibrium in all types of games.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'IQL is not guaranteed to converge in all games. Analysis shows that in some game classes (like certain Prisoner\'s Dilemma variants), IQL may exhibit chaotic non-convergent behavior. Its convergence depends on the specific structure of the game.',
    relatedCardIds: ['rc-marl-5.4-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-5.4-3',
    lessonId: 'marl-5.4',
    question:
      'In independent learning, each agent i learns its own policy using only its _____ history of own observations, actions, and rewards.',
    type: 'fill-blank',
    correctAnswer: 'local',
    explanation:
      'Independent learning agents use only their local information -- their own observations, actions, and rewards -- while ignoring the existence of other agents. This naturally avoids the exponential action space problem but introduces non-stationarity challenges.',
    relatedCardIds: ['rc-marl-5.4-3'],
    order: 3,
  },

  // --- Lesson marl-5.5: Non-Stationarity in MARL ---
  {
    id: 'quiz-marl-5.5-1',
    lessonId: 'marl-5.5',
    question:
      'Why is non-stationarity a more severe problem in MARL than in single-agent RL?',
    type: 'multiple-choice',
    options: [
      'Because MARL uses larger state spaces',
      'Because in MARL, multiple agents change their policies simultaneously, making the entire environment appear non-stationary from each agent\'s perspective',
      'Because MARL algorithms use higher learning rates',
      'Because MARL environments always have stochastic transitions',
    ],
    correctAnswer:
      'Because in MARL, multiple agents change their policies simultaneously, making the entire environment appear non-stationary from each agent\'s perspective',
    explanation:
      'In single-agent RL, non-stationarity comes only from the agent\'s own changing policy. In MARL, all agents change simultaneously, so from each agent\'s perspective, the entire environment\'s transition dynamics are non-stationary due to other agents\' evolving policies.',
    relatedCardIds: ['rc-marl-5.5-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-5.5-2',
    lessonId: 'marl-5.5',
    question:
      'The standard stochastic approximation conditions sufficient for single-agent TD convergence are also sufficient for guaranteed convergence in MARL.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'The stochastic approximation conditions from single-agent RL are usually not sufficient in MARL due to the additional non-stationarity from multiple learning agents. Known theoretical convergence results in MARL are limited to specific games and algorithms.',
    relatedCardIds: ['rc-marl-5.5-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-5.5-3',
    lessonId: 'marl-5.5',
    question:
      'The non-stationarity problem in MARL is also referred to as the moving _____ problem because value estimates constantly change as agents adapt.',
    type: 'fill-blank',
    correctAnswer: 'target',
    explanation:
      'The moving target problem occurs because the update targets in value learning keep changing as other agents\' policies evolve. Each agent is trying to hit a target that is constantly shifting due to concurrent policy changes by all agents.',
    relatedCardIds: ['rc-marl-5.5-3'],
    order: 3,
  },

  // --- Lesson marl-5.6: Equilibrium Selection and Credit Assignment ---
  {
    id: 'quiz-marl-5.6-1',
    lessonId: 'marl-5.6',
    question:
      'In the Stag Hunt game, which equilibrium tends to attract independent Q-learning agents during early learning?',
    type: 'multiple-choice',
    options: [
      'The reward-dominant equilibrium (S,S)',
      'The risk-dominant equilibrium (H,H)',
      'The probabilistic equilibrium',
      'The Pareto-optimal equilibrium',
    ],
    correctAnswer: 'The risk-dominant equilibrium (H,H)',
    explanation:
      'IQL agents tend toward the risk-dominant equilibrium (H,H) because early random exploration reveals that action H guarantees at least reward 2, while action S risks 0. This creates a feedback loop reinforcing the risk-dominant choice.',
    relatedCardIds: ['rc-marl-5.6-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-5.6-2',
    lessonId: 'marl-5.6',
    question:
      'Multi-agent credit assignment only exists in common-reward settings where all agents receive the same reward.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'While especially prominent in common-reward settings, multi-agent credit assignment exists more generally. Even with individual rewards, each agent still needs to understand whose actions contributed to its received reward, such as distinguishing between its own contributions and those of others.',
    relatedCardIds: ['rc-marl-5.6-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-5.6-3',
    lessonId: 'marl-5.6',
    question:
      'The reward-_____ equilibrium is the one that yields higher rewards to agents than all other equilibria, while the risk-dominant equilibrium has the lowest risk.',
    type: 'fill-blank',
    correctAnswer: 'dominant',
    explanation:
      'In games like Stag Hunt, the reward-dominant equilibrium (S,S) gives the highest rewards and is Pareto-optimal, while the risk-dominant equilibrium (H,H) offers agents the highest guaranteed minimum reward with lower risk.',
    relatedCardIds: ['rc-marl-5.6-3'],
    order: 3,
  },

  // --- Lesson marl-5.7: Self-Play and Mixed-Play ---
  {
    id: 'quiz-marl-5.7-1',
    lessonId: 'marl-5.7',
    question:
      'What is the difference between algorithm self-play and policy self-play?',
    type: 'multiple-choice',
    options: [
      'Algorithm self-play uses deep learning while policy self-play uses tabular methods',
      'In algorithm self-play all agents use the same learning algorithm; in policy self-play an agent\'s policy is trained directly against itself',
      'Algorithm self-play is for cooperative games while policy self-play is for competitive games',
      'There is no meaningful difference between the two',
    ],
    correctAnswer:
      'In algorithm self-play all agents use the same learning algorithm; in policy self-play an agent\'s policy is trained directly against itself',
    explanation:
      'Algorithm self-play means all agents use the same learning algorithm (potentially learning different policies). Policy self-play is more literal: the same policy is used for all agents, training against copies of itself. Policy self-play implies algorithm self-play but requires symmetrical agent roles.',
    relatedCardIds: ['rc-marl-5.7-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-5.7-2',
    lessonId: 'marl-5.7',
    question:
      'Policy self-play can be used in any game regardless of whether agents have symmetrical roles and observations.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation:
      'Policy self-play requires agents to have symmetrical roles and egocentric observations so that the same policy can work from each agent\'s perspective. Algorithm self-play has no such restriction -- the same algorithm can learn different policies for agents with different roles.',
    relatedCardIds: ['rc-marl-5.7-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-5.7-3',
    lessonId: 'marl-5.7',
    question:
      '_____-play describes the setting in which agents use different learning algorithms, such as trading agents developed by different organizations.',
    type: 'fill-blank',
    correctAnswer: 'Mixed',
    explanation:
      'Mixed-play is when agents use different learning algorithms. Examples include trading markets with diverse agent strategies and ad hoc teamwork where agents must collaborate with unknown partners. Studies show no single algorithm dominates in mixed-play settings.',
    relatedCardIds: ['rc-marl-5.7-3'],
    order: 3,
  },
  // =============================================
  // MODULE 6: Foundational Algorithms (marl-6.1 to marl-6.10)
  // =============================================

  // --- Lesson 6.1: Value Iteration for Games ---
  {
    id: 'quiz-marl-6.1-1',
    lessonId: 'marl-6.1',
    question: 'In Shapley\'s value iteration algorithm for zero-sum stochastic games, what replaces the max-operator used in MDP value iteration?',
    type: 'multiple-choice',
    options: [
      'A min-operator over the opponent\'s actions',
      'The Valuei-operator based on minimax solutions of normal-form games',
      'A Nash equilibrium solver applied to action-value pairs',
      'A random sampling operator over joint actions',
    ],
    correctAnswer: 'The Valuei-operator based on minimax solutions of normal-form games',
    explanation: 'Shapley\'s value iteration replaces the max-operator with the Valuei-operator, which computes minimax values of non-repeated normal-form games constructed from the state value matrices Ms,i for each state.',
    relatedCardIds: ['rc-marl-6.1-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.1-2',
    lessonId: 'marl-6.1',
    question: 'In a stochastic game with a single agent, Shapley\'s value iteration algorithm reduces to standard MDP value iteration.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'When there is only a single agent, the Valuei-operator reduces to the max-operator over actions, which is exactly the MDP value iteration update rule.',
    relatedCardIds: ['rc-marl-6.1-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.1-3',
    lessonId: 'marl-6.1',
    question: 'The convergence of value iteration in zero-sum stochastic games is guaranteed because the update operator is a _____ mapping.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'contraction',
    explanation: 'By the Banach fixed-point theorem, the update operator in Equation 6.4 is a gamma-contraction mapping, which guarantees convergence to a unique fixed point representing the optimal values.',
    relatedCardIds: ['rc-marl-6.1-3'],
    order: 3,
  },

  // --- Lesson 6.2: Joint-Action Learning (JAL) ---
  {
    id: 'quiz-marl-6.2-1',
    lessonId: 'marl-6.2',
    question: 'What is the key idea behind Joint-Action Learning with Game Theory (JAL-GT) algorithms?',
    type: 'multiple-choice',
    options: [
      'Learning individual Q-values for each agent independently',
      'Viewing the joint-action values as normal-form games and using solution concepts to derive policies and update targets',
      'Using a centralized controller to select joint actions',
      'Training a single neural network for all agents simultaneously',
    ],
    correctAnswer: 'Viewing the joint-action values as normal-form games and using solution concepts to derive policies and update targets',
    explanation: 'JAL-GT algorithms treat the joint-action values Q1(s,.), ..., Qn(s,.) as a normal-form game for each state s, then apply game-theoretic solution concepts such as minimax or Nash equilibrium to compute policies and update targets.',
    relatedCardIds: ['rc-marl-6.2-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.2-2',
    lessonId: 'marl-6.2',
    question: 'JAL-GT algorithms only need to observe the actions of other agents, not their rewards.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'JAL-GT algorithms observe the actions AND rewards of all agents in each time step, and maintain joint-action value functions Qj for every agent j, in order to construct the normal-form games for each state.',
    relatedCardIds: ['rc-marl-6.2-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.2-3',
    lessonId: 'marl-6.2',
    question: 'Joint-action learning algorithms learn joint-action value functions that estimate the expected returns of _____ actions in any given state.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'joint',
    explanation: 'As the name suggests, JAL algorithms learn joint-action value functions Qi(s, a1, ..., an) that estimate the expected returns of joint actions (all agents\' actions together) in any given state.',
    relatedCardIds: ['rc-marl-6.2-3'],
    order: 3,
  },

  // --- Lesson 6.3: Minimax-Q / Nash-Q / Correlated-Q ---
  {
    id: 'quiz-marl-6.3-1',
    lessonId: 'marl-6.3',
    question: 'What is a key limitation of Nash Q-learning\'s convergence guarantees?',
    type: 'multiple-choice',
    options: [
      'It can only be applied to zero-sum games',
      'It requires that all encountered normal-form games either all have a global optimum or all have a saddle point',
      'It cannot learn stochastic policies',
      'It requires full knowledge of the reward functions of all agents',
    ],
    correctAnswer: 'It requires that all encountered normal-form games either all have a global optimum or all have a saddle point',
    explanation: 'Nash Q-learning requires highly restrictive assumptions: all encountered normal-form games must either all have a global optimum or all have a saddle point, which is unlikely to hold in practice.',
    relatedCardIds: ['rc-marl-6.3-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.3-2',
    lessonId: 'marl-6.3',
    question: 'Correlated Q-learning can be more efficient than Nash Q-learning because correlated equilibria can be computed via linear programming, while Nash equilibria require quadratic programming.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'This is one of the two key benefits of correlated Q-learning: correlated equilibria can be computed efficiently via linear programming, whereas computing Nash equilibria requires the more expensive quadratic programming.',
    relatedCardIds: ['rc-marl-6.3-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.3-3',
    lessonId: 'marl-6.3',
    question: 'Minimax Q-learning is guaranteed to learn the unique minimax value of a two-agent _____ stochastic game.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'zero-sum',
    explanation: 'Minimax Q-learning applies to two-agent zero-sum stochastic games and is guaranteed to learn the unique minimax value under standard assumptions about state-action visitation and learning rates.',
    relatedCardIds: ['rc-marl-6.3-3'],
    order: 3,
  },

  // --- Lesson 6.4: Fictitious Play ---
  {
    id: 'quiz-marl-6.4-1',
    lessonId: 'marl-6.4',
    question: 'In fictitious play, how does each agent model the policy of other agents?',
    type: 'multiple-choice',
    options: [
      'By training a neural network on observed state-action pairs',
      'By taking the empirical distribution of the other agent\'s past actions',
      'By computing Nash equilibrium policies from the reward matrix',
      'By using a Bayesian posterior over a finite set of policy types',
    ],
    correctAnswer: 'By taking the empirical distribution of the other agent\'s past actions',
    explanation: 'In fictitious play, each agent models each other agent\'s policy as a stationary probability distribution estimated by taking the empirical distribution of that agent\'s past actions.',
    relatedCardIds: ['rc-marl-6.4-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.4-2',
    lessonId: 'marl-6.4',
    question: 'In fictitious play, the empirical distribution of each agent\'s actions is guaranteed to converge to a Nash equilibrium in all types of games.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'The empirical distributions converge in several game classes, including two-agent zero-sum games with finite action sets, but not in all types of games.',
    relatedCardIds: ['rc-marl-6.4-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.4-3',
    lessonId: 'marl-6.4',
    question: 'Fictitious play chooses actions using a best-_____ strategy against the learned models of other agents.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'response',
    explanation: 'In each episode, each agent chooses a best-response action against the models of other agents\' policies, selecting the action that maximizes expected reward given the estimated policies of the opponents.',
    relatedCardIds: ['rc-marl-6.4-3'],
    order: 3,
  },

  // --- Lesson 6.5: Agent Modelling ---
  {
    id: 'quiz-marl-6.5-1',
    lessonId: 'marl-6.5',
    question: 'What is the most common type of agent modeling used in MARL?',
    type: 'multiple-choice',
    options: [
      'Goal inference from trajectory data',
      'Policy reconstruction from observed actions',
      'Belief modeling of environmental states',
      'Reward function estimation via inverse RL',
    ],
    correctAnswer: 'Policy reconstruction from observed actions',
    explanation: 'Policy reconstruction is the most common type of agent modeling in MARL. It aims to learn models of other agents\' policies based on their observed past actions, which can be framed as a supervised learning problem.',
    relatedCardIds: ['rc-marl-6.5-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.5-2',
    lessonId: 'marl-6.5',
    question: 'JAL-AM (Joint-Action Learning with Agent Modeling) requires observing the rewards of other agents.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Unlike JAL-GT, which requires observing the rewards of other agents and maintaining joint-action value functions for every agent, JAL-AM does not require observing the rewards of other agents and only maintains a single joint-action value function for the learning agent.',
    relatedCardIds: ['rc-marl-6.5-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.5-3',
    lessonId: 'marl-6.5',
    question: 'Agent modeling is also known as _____ modeling, a term originating from early research focused on competitive games.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'opponent',
    explanation: 'The term "opponent modeling" was originally used because much of the early research focused on competitive games such as chess. The more neutral term "agent modeling" is preferred since other agents may not necessarily be opponents.',
    relatedCardIds: ['rc-marl-6.5-3'],
    order: 3,
  },

  // --- Lesson 6.6: Bayesian Learning ---
  {
    id: 'quiz-marl-6.6-1',
    lessonId: 'marl-6.6',
    question: 'In Bayesian agent modeling, what does the Value of Information (VI) evaluate?',
    type: 'multiple-choice',
    options: [
      'The total expected reward across all possible agent models',
      'How the outcomes of an action may influence the agent\'s beliefs and future actions',
      'The entropy of the probability distribution over agent models',
      'The difference between Bayesian and frequentist estimates of policy parameters',
    ],
    correctAnswer: 'How the outcomes of an action may influence the agent\'s beliefs and future actions',
    explanation: 'VI evaluates how the outcomes of an action may influence the learning agent\'s beliefs about other agents, how the changed beliefs will influence the agent\'s future actions, and how the action may influence the future behavior of the modeled agents.',
    relatedCardIds: ['rc-marl-6.6-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.6-2',
    lessonId: 'marl-6.6',
    question: 'In the Prisoner\'s Dilemma example with Coop and Grim models, cooperating initially provides the agent with information about which model the opponent uses.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Cooperating initially provides no information gain since both Coop and Grim cooperate in response to the agent cooperating. In contrast, defecting reveals which model the opponent uses because Grim would defect in response while Coop continues cooperating.',
    relatedCardIds: ['rc-marl-6.6-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.6-3',
    lessonId: 'marl-6.6',
    question: 'In Bayesian agent modeling, the agent updates its beliefs about other agents\' models using a Bayesian _____ distribution.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'posterior',
    explanation: 'After observing another agent\'s action, the modeling agent updates its belief by computing a Bayesian posterior distribution, which revises the probability assigned to each possible model based on the observed action and prior belief.',
    relatedCardIds: ['rc-marl-6.6-3'],
    order: 3,
  },

  // --- Lesson 6.7: Policy Gradients for MARL ---
  {
    id: 'quiz-marl-6.7-1',
    lessonId: 'marl-6.7',
    question: 'What is the main advantage of policy-based learning algorithms over value-based methods in MARL?',
    type: 'multiple-choice',
    options: [
      'They require fewer computational resources',
      'They can directly learn probabilistic policies and represent probabilistic equilibria',
      'They always converge faster than value-based methods',
      'They do not require knowledge of other agents\' actions',
    ],
    correctAnswer: 'They can directly learn probabilistic policies and represent probabilistic equilibria',
    explanation: 'Policy-based learning algorithms can directly learn action probabilities in policies, meaning they can represent probabilistic equilibria, which is something value-based methods like fictitious play and JAL-AM cannot do since they use deterministic best-response actions.',
    relatedCardIds: ['rc-marl-6.7-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.7-2',
    lessonId: 'marl-6.7',
    question: 'Infinitesimal gradient ascent (IGA) guarantees that the actual joint policies always converge to a Nash equilibrium.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'IGA does not guarantee that the actual policies converge in all cases. When the matrix F has purely imaginary eigenvalues, the joint policy may cycle indefinitely on an ellipse. However, the average rewards converge to Nash equilibrium expected rewards.',
    relatedCardIds: ['rc-marl-6.7-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.7-3',
    lessonId: 'marl-6.7',
    question: 'In infinitesimal gradient ascent, each agent updates its policy in the direction of the _____ in expected reward.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'gradient',
    explanation: 'Each agent updates its policy using gradient-ascent techniques, following the gradient of their expected reward with respect to their policy parameters.',
    relatedCardIds: ['rc-marl-6.7-3'],
    order: 3,
  },

  // --- Lesson 6.8: WoLF ---
  {
    id: 'quiz-marl-6.8-1',
    lessonId: 'marl-6.8',
    question: 'What is the core principle of the WoLF (Win or Learn Fast) algorithm?',
    type: 'multiple-choice',
    options: [
      'Use a high learning rate at all times for faster convergence',
      'Use a large learning rate when losing and a small learning rate when winning',
      'Switch between value-based and policy-based methods depending on performance',
      'Alternate between exploration and exploitation phases',
    ],
    correctAnswer: 'Use a large learning rate when losing and a small learning rate when winning',
    explanation: 'WoLF uses a variable learning rate: learning quickly (high rate) when losing to catch up, and learning slowly (low rate) when winning since the other agent will likely change its policy.',
    relatedCardIds: ['rc-marl-6.8-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.8-2',
    lessonId: 'marl-6.8',
    question: 'WoLF-PHC can only be used in normal-form games with two agents and two actions.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'While IGA and WoLF-IGA are defined only for two agents and two actions, WoLF-PHC generalizes to general-sum stochastic games with any finite number of agents and actions, and does not require knowledge of reward functions or other agents\' policies.',
    relatedCardIds: ['rc-marl-6.8-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.8-3',
    lessonId: 'marl-6.8',
    question: 'WoLF-PHC determines whether it is winning or losing by comparing its expected reward to that of an _____ policy.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'average',
    explanation: 'WoLF-PHC compares the expected reward of the current policy to an average policy that averages over past policies, which serves as a substitute for the unknown Nash equilibrium policy.',
    relatedCardIds: ['rc-marl-6.8-3'],
    order: 3,
  },

  // --- Lesson 6.9: Regret Matching / CFR ---
  {
    id: 'quiz-marl-6.9-1',
    lessonId: 'marl-6.9',
    question: 'What does regret matching aim to minimize in the context of MARL?',
    type: 'multiple-choice',
    options: [
      'The expected reward difference between agents',
      'Different notions of regret that measure how much better the agent could have done by playing differently',
      'The divergence between the learned policy and a Nash equilibrium',
      'The number of time steps needed to converge to a stable policy',
    ],
    correctAnswer: 'Different notions of regret that measure how much better the agent could have done by playing differently',
    explanation: 'Regret matching algorithms aim to minimize different notions of regret, which measure how much better an agent could have done in hindsight if it had played a different action or strategy.',
    relatedCardIds: ['rc-marl-6.9-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.9-2',
    lessonId: 'marl-6.9',
    question: 'The generalized infinitesimal gradient ascent (GIGA) algorithm requires knowledge of other agents\' policies.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'GIGA does not require knowledge of the other agents\' policies but assumes that it can observe the past actions of the other agents. It generalizes IGA to normal-form games with more than two agents and actions.',
    relatedCardIds: ['rc-marl-6.9-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.9-3',
    lessonId: 'marl-6.9',
    question: 'GIGA achieves the no-_____ property, meaning the agent does not regret its past action choices in the long run.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'regret',
    explanation: 'GIGA achieves no-regret, which implies that the average regret over all past actions converges to zero, meaning the agent asymptotically performs as well as the best fixed strategy in hindsight.',
    relatedCardIds: ['rc-marl-6.9-3'],
    order: 3,
  },

  // --- Lesson 6.10: Algorithm Landscape ---
  {
    id: 'quiz-marl-6.10-1',
    lessonId: 'marl-6.10',
    question: 'Why is it impossible to construct a JAL-GT algorithm that converges to an equilibrium in ALL general-sum stochastic games?',
    type: 'multiple-choice',
    options: [
      'The computational complexity is always NP-hard',
      'There exist NoSDE games where the joint-action Q-values are insufficient to derive equilibrium policies',
      'General-sum games never have Nash equilibria',
      'The reward functions are always unknown in general-sum games',
    ],
    correctAnswer: 'There exist NoSDE games where the joint-action Q-values are insufficient to derive equilibrium policies',
    explanation: 'Zinkevich, Greenwald, and Littman (2005) proved that there exist NoSDE (No Stationary Deterministic Equilibrium) games where the information in joint-action value functions is insufficient to reconstruct the required probabilistic equilibrium policies.',
    relatedCardIds: ['rc-marl-6.10-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-6.10-2',
    lessonId: 'marl-6.10',
    question: 'All four classes of foundational MARL algorithms (JAL, agent modeling, policy-based, and regret matching) can learn exact Nash equilibria in any stochastic game.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Each class has specific limitations. JAL-GT cannot learn equilibria in NoSDE games, fictitious play and JAL-AM cannot learn probabilistic policies, and different algorithms have different convergence guarantees depending on the game type.',
    relatedCardIds: ['rc-marl-6.10-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-6.10-3',
    lessonId: 'marl-6.10',
    question: 'NoSDE stands for "No Stationary _____ Equilibrium," a class of games that is problematic for JAL-GT algorithms.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'Deterministic',
    explanation: 'NoSDE stands for "No Stationary Deterministic Equilibrium." These are turn-taking stochastic games that have a unique stationary probabilistic equilibrium but no stationary deterministic equilibrium, making them problematic for JAL-GT.',
    relatedCardIds: ['rc-marl-6.10-3'],
    order: 3,
  },

  // =============================================
  // MODULE 7: Deep Learning (marl-7.1 to marl-7.9)
  // =============================================

  // --- Lesson 7.1: Function Approximation ---
  {
    id: 'quiz-marl-7.1-1',
    lessonId: 'marl-7.1',
    question: 'What is the primary limitation of tabular value functions that motivates the use of function approximation?',
    type: 'multiple-choice',
    options: [
      'They cannot represent stochastic policies',
      'They cannot generalize to unvisited states and grow linearly with the number of possible inputs',
      'They require too much computational power per update',
      'They can only be used in single-agent environments',
    ],
    correctAnswer: 'They cannot generalize to unvisited states and grow linearly with the number of possible inputs',
    explanation: 'Tabular value functions have two key limitations: the table grows linearly with state-action pairs (infeasible for complex problems), and they update each value estimate in isolation without generalizing to similar unvisited states.',
    relatedCardIds: ['rc-marl-7.1-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-7.1-2',
    lessonId: 'marl-7.1',
    question: 'The state space of the board game Go is estimated to contain approximately 10^170 possible states.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'The state space of Go is estimated at approximately 10^170 possible states, which makes storing and managing a tabular value function completely infeasible for modern computers.',
    relatedCardIds: ['rc-marl-7.1-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-7.1-3',
    lessonId: 'marl-7.1',
    question: 'Function approximation learns a parameterized function f(x; theta) to approximate a target function f*(x), enabling _____ across states.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'generalization',
    explanation: 'Function approximation enables generalization across states by learning shared parameters theta that can provide reasonable value estimates even for states that have not been directly encountered during training.',
    relatedCardIds: ['rc-marl-7.1-3'],
    order: 3,
  },

  // --- Lesson 7.2: Neural Networks ---
  {
    id: 'quiz-marl-7.2-1',
    lessonId: 'marl-7.2',
    question: 'According to the universal approximation theorem, what capability do feedforward neural networks have?',
    type: 'multiple-choice',
    options: [
      'They can solve any optimization problem in polynomial time',
      'They can approximate any continuous function given sufficient hidden units in a single hidden layer',
      'They can learn from a single training example',
      'They always converge to the global optimum during training',
    ],
    correctAnswer: 'They can approximate any continuous function given sufficient hidden units in a single hidden layer',
    explanation: 'The universal approximation theorem states that feedforward neural networks with as few as a single hidden layer can approximate any continuous function on a closed and bounded subset given sufficient hidden units.',
    relatedCardIds: ['rc-marl-7.2-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-7.2-2',
    lessonId: 'marl-7.2',
    question: 'Feedforward neural networks are also known as multi-layer perceptrons (MLPs).',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Feedforward neural networks are also called deep feedforward networks, fully connected neural networks, or multi-layer perceptrons (MLPs), and they are the simplest and most prominent architecture of neural networks.',
    relatedCardIds: ['rc-marl-7.2-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-7.2-3',
    lessonId: 'marl-7.2',
    question: 'The number of layers in a neural network is called the _____ of the network.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'depth',
    explanation: 'The number of layers is referred to as the depth of the neural network, while the number of units in a layer is referred to as the width or hidden dimension.',
    relatedCardIds: ['rc-marl-7.2-3'],
    order: 3,
  },

  // --- Lesson 7.3: Backpropagation ---
  {
    id: 'quiz-marl-7.3-1',
    lessonId: 'marl-7.3',
    question: 'Which mathematical principle does the backpropagation algorithm use to efficiently compute gradients through a neural network?',
    type: 'multiple-choice',
    options: [
      'The law of large numbers',
      'The chain rule of derivatives',
      'Bayes\' theorem',
      'The central limit theorem',
    ],
    correctAnswer: 'The chain rule of derivatives',
    explanation: 'Backpropagation uses the chain rule of derivatives, which allows computing gradients of a compositional function (the neural network) with respect to all parameters by traversing the network backward from output to input layer.',
    relatedCardIds: ['rc-marl-7.3-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-7.3-2',
    lessonId: 'marl-7.3',
    question: 'Non-linear activation functions in neural units are optional and can be removed without affecting the network\'s representational power.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Non-linear activation functions are essential because the composition of two linear functions can only represent a linear function. Without non-linear activations, composing any number of neural units would only result in a linear function.',
    relatedCardIds: ['rc-marl-7.3-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-7.3-3',
    lessonId: 'marl-7.3',
    question: 'The forward pass computes network output from input, while the _____ pass propagates gradients from output to input.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'backward',
    explanation: 'The backward pass (backpropagation) traverses the network from the output layer to the input layer, applying the chain rule to propagate gradients and compute derivatives with respect to all network parameters.',
    relatedCardIds: ['rc-marl-7.3-3'],
    order: 3,
  },

  // --- Lesson 7.4: CNN/RNN ---
  {
    id: 'quiz-marl-7.4-1',
    lessonId: 'marl-7.4',
    question: 'Why are convolutional neural networks (CNNs) more parameter-efficient than feedforward networks for processing images?',
    type: 'multiple-choice',
    options: [
      'They use larger weight matrices that capture more information',
      'They share the same filter parameters across the entire input through convolution operations',
      'They process images at a lower resolution',
      'They only look at the most important pixels',
    ],
    correctAnswer: 'They share the same filter parameters across the entire input through convolution operations',
    explanation: 'CNNs share parameters by sliding small filters over the input. For example, sixteen 5x5 filters need only 1,216 parameters to process a 128x128 RGB image, compared to over 6 million parameters for a feedforward network with 128 hidden units.',
    relatedCardIds: ['rc-marl-7.4-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-7.4-2',
    lessonId: 'marl-7.4',
    question: 'Recurrent neural networks (RNNs) process an entire input sequence in a single forward pass, similar to feedforward networks.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'RNNs sequentially process inputs one at a time, maintaining a hidden state as a compact representation of the history of previous inputs. At each step, the network takes both the current input and the previous hidden state to produce a new hidden state.',
    relatedCardIds: ['rc-marl-7.4-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-7.4-3',
    lessonId: 'marl-7.4',
    question: 'The most commonly used RNN architectures are LSTMs and _____ (GRUs).',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'gated recurrent units',
    explanation: 'The most commonly used and effective recurrent neural network architectures are long short-term memory cells (LSTMs) and gated recurrent units (GRUs), both designed to address vanishing and exploding gradients.',
    relatedCardIds: ['rc-marl-7.4-3'],
    order: 3,
  },

  // --- Lesson 7.5: DQN ---
  {
    id: 'quiz-marl-7.5-1',
    lessonId: 'marl-7.5',
    question: 'What are the three components of the "deadly triad" in reinforcement learning?',
    type: 'multiple-choice',
    options: [
      'Exploration, exploitation, and credit assignment',
      'Off-policy learning, function approximation, and bootstrapped targets',
      'Non-stationarity, partial observability, and multi-agent interaction',
      'Policy gradient, value function, and reward shaping',
    ],
    correctAnswer: 'Off-policy learning, function approximation, and bootstrapped targets',
    explanation: 'The deadly triad consists of off-policy learning, function approximation, and bootstrapped targets. The combination of all three can lead to unstable and diverging value estimates.',
    relatedCardIds: ['rc-marl-7.5-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-7.5-2',
    lessonId: 'marl-7.5',
    question: 'DQN addresses the moving target problem by using a separate target network whose parameters are periodically updated.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'DQN uses a target network with parameters that are periodically copied from the main network, ensuring bootstrapped target values remain stable for a fixed number of updates.',
    relatedCardIds: ['rc-marl-7.5-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-7.5-3',
    lessonId: 'marl-7.5',
    question: 'DQN stores experiences in a replay _____ and samples random mini-batches to break correlations between consecutive samples.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'buffer',
    explanation: 'DQN uses a replay buffer to store experience samples and then samples mini-batches uniformly at random, which breaks the correlation between consecutive experiences and allows experience reuse.',
    relatedCardIds: ['rc-marl-7.5-3'],
    order: 3,
  },

  // --- Lesson 7.6: REINFORCE ---
  {
    id: 'quiz-marl-7.6-1',
    lessonId: 'marl-7.6',
    question: 'What is the main drawback of using Monte Carlo return estimates in the REINFORCE algorithm?',
    type: 'multiple-choice',
    options: [
      'They introduce significant bias into the gradient estimates',
      'They have high variance due to dependence on all states and actions in an episode',
      'They can only be used in fully observable environments',
      'They require a replay buffer for stability',
    ],
    correctAnswer: 'They have high variance due to dependence on all states and actions in an episode',
    explanation: 'Monte Carlo return estimates have high variance because the returns of each episode depend on all states and actions encountered within the episode, both of which are samples of probabilistic functions.',
    relatedCardIds: ['rc-marl-7.6-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-7.6-2',
    lessonId: 'marl-7.6',
    question: 'The policy gradient theorem requires on-policy data, meaning experiences must be generated by the currently optimized policy.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'The policy gradient theorem assumes the state distribution and action values are given under the currently optimized policy, restricting updates to on-policy data and preventing the use of a replay buffer.',
    relatedCardIds: ['rc-marl-7.6-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-7.6-3',
    lessonId: 'marl-7.6',
    question: 'In the policy gradient theorem, policy preferences are transformed into probabilities using the _____ function.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'softmax',
    explanation: 'The policy network outputs scalar preferences for each action, which are transformed into a probability distribution using the softmax function: the exponential of each preference divided by the sum of all exponentials.',
    relatedCardIds: ['rc-marl-7.6-3'],
    order: 3,
  },

  // --- Lesson 7.7: A2C/PPO ---
  {
    id: 'quiz-marl-7.7-1',
    lessonId: 'marl-7.7',
    question: 'What does the advantage function Adv(s,a) in A2C measure?',
    type: 'multiple-choice',
    options: [
      'The absolute expected return when taking action a in state s',
      'The difference between the action value Q(s,a) and the state value V(s)',
      'The probability of selecting action a in state s',
      'The learning rate adjustment needed for action a',
    ],
    correctAnswer: 'The difference between the action value Q(s,a) and the state value V(s)',
    explanation: 'The advantage Adv(s,a) = Q(s,a) - V(s) quantifies how much higher the expected returns are when applying action a compared to following the current policy in state s. Positive advantage means the action is better than average.',
    relatedCardIds: ['rc-marl-7.7-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-7.7-2',
    lessonId: 'marl-7.7',
    question: 'PPO uses importance sampling weights to allow multiple updates using the same batch of experience data.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'PPO uses importance sampling weights (ratio of current policy probability to behavior policy probability) with clipping to safely update the policy multiple times using the same data, improving sample efficiency.',
    relatedCardIds: ['rc-marl-7.7-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-7.7-3',
    lessonId: 'marl-7.7',
    question: 'PPO clips the importance sampling ratio to stay within [1-epsilon, 1+epsilon] to prevent large policy _____ in a single update step.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'changes',
    explanation: 'PPO clips the importance sampling weight to prevent significant changes to the policy in a single optimization step, implementing a computationally efficient version of trust region optimization.',
    relatedCardIds: ['rc-marl-7.7-3'],
    order: 3,
  },

  // --- Lesson 7.8: Practical Tips ---
  {
    id: 'quiz-marl-7.8-1',
    lessonId: 'marl-7.8',
    question: 'Which gradient descent method provides the best trade-off between gradient stability and computational cost?',
    type: 'multiple-choice',
    options: [
      'Vanilla gradient descent',
      'Stochastic gradient descent (single sample)',
      'Mini-batch gradient descent',
      'Full-batch gradient descent with momentum',
    ],
    correctAnswer: 'Mini-batch gradient descent',
    explanation: 'Mini-batch gradient descent provides the best trade-off: it approaches vanilla gradient descent\'s stability with batch sizes as small as 32, while remaining computationally cheap like stochastic gradient descent.',
    relatedCardIds: ['rc-marl-7.8-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-7.8-2',
    lessonId: 'marl-7.8',
    question: 'The Adam optimizer has emerged as a common default choice for optimizing neural network parameters.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'While no optimizer consistently performs better than all others, the Adam optimizer has emerged as a common choice and is often applied as the default optimizer in deep learning.',
    relatedCardIds: ['rc-marl-7.8-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-7.8-3',
    lessonId: 'marl-7.8',
    question: 'The phenomenon where a neural network forgets previously learned information when trained on new data is called catastrophic _____.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'forgetting',
    explanation: 'Catastrophic forgetting occurs when updating the value function with new experiences causes the agent to forget previously learned behaviors, a fundamental challenge further exacerbated in RL by changing data distributions.',
    relatedCardIds: ['rc-marl-7.8-3'],
    order: 3,
  },

  // --- Lesson 7.9: Observations, States, and Histories ---
  {
    id: 'quiz-marl-7.9-1',
    lessonId: 'marl-7.9',
    question: 'In partially observable environments, how can deep RL agents condition their policies on the history of observations?',
    type: 'multiple-choice',
    options: [
      'By increasing the replay buffer size',
      'By using recurrent neural networks that maintain a hidden state representing past observations',
      'By ignoring previous observations and only using the current state',
      'By storing all past observations in a lookup table',
    ],
    correctAnswer: 'By using recurrent neural networks that maintain a hidden state representing past observations',
    explanation: 'Recurrent neural networks like LSTMs and GRUs can receive one observation at a time and internally represent the observation history as a hidden state, enabling efficient conditioning on the full history.',
    relatedCardIds: ['rc-marl-7.9-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-7.9-2',
    lessonId: 'marl-7.9',
    question: 'On-policy algorithms like A2C and PPO can use a replay buffer to improve sample efficiency, just like DQN.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'On-policy policy gradient algorithms cannot use a replay buffer because the policy gradient theorem requires experiences generated by the current policy. A replay buffer contains off-policy experiences from older policy versions.',
    relatedCardIds: ['rc-marl-7.9-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-7.9-3',
    lessonId: 'marl-7.9',
    question: 'To run on-policy algorithms without a replay buffer, multiple _____ environments can be run in parallel to collect larger batches of experience.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'parallel',
    explanation: 'Since on-policy algorithms cannot reuse past experiences, running multiple parallel environments simultaneously provides larger batches of on-policy data for more stable gradient computation and faster training.',
    relatedCardIds: ['rc-marl-7.9-3'],
    order: 3,
  },

  // =============================================
  // MODULE 8: Deep RL for MARL (marl-8.1 to marl-8.10)
  // =============================================

  // --- Lesson 8.1: CTDE ---
  {
    id: 'quiz-marl-8.1-1',
    lessonId: 'marl-8.1',
    question: 'What does the CTDE paradigm in MARL stand for?',
    type: 'multiple-choice',
    options: [
      'Central Training with Distributed Environments',
      'Centralized Training with Decentralized Execution',
      'Coordinated Training and Decentralized Evaluation',
      'Common Training with Differentiated Execution',
    ],
    correctAnswer: 'Centralized Training with Decentralized Execution',
    explanation: 'CTDE stands for Centralized Training with Decentralized Execution. During training, algorithms can use shared information from all agents, while each agent\'s policy only needs local observations for action selection.',
    relatedCardIds: ['rc-marl-8.1-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.1-2',
    lessonId: 'marl-8.1',
    question: 'In CTDE, agent policies can use information about all agents during execution since it was available during training.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'In CTDE, policies are designed for decentralized execution: each agent\'s policy only requires the agent\'s local observation to select actions. Centralized information is only used during training, not during execution.',
    relatedCardIds: ['rc-marl-8.1-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.1-3',
    lessonId: 'marl-8.1',
    question: 'In independent learning, each agent treats other agents as part of the _____, leading to non-stationarity.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'environment',
    explanation: 'In independent learning, each agent does not explicitly model other agents. Instead, other agents are viewed as a non-stationary part of the environment dynamics, causing the transition and reward functions to change as other agents\' policies evolve.',
    relatedCardIds: ['rc-marl-8.1-3'],
    order: 3,
  },

  // --- Lesson 8.2: Independent Deep Learning ---
  {
    id: 'quiz-marl-8.2-1',
    lessonId: 'marl-8.2',
    question: 'What is a key challenge of using a replay buffer in Independent DQN (IDQN)?',
    type: 'multiple-choice',
    options: [
      'The replay buffer is too small for multi-agent environments',
      'Stored experiences become outdated as other agents\' policies change during training',
      'Replay buffers cannot store observations from multiple agents',
      'Sampling from the buffer always produces biased gradients',
    ],
    correctAnswer: 'Stored experiences become outdated as other agents\' policies change during training',
    explanation: 'In multi-agent settings, the policies of other agents change during training, which can make experiences in the replay buffer quickly become outdated, leading agents to learn from irrelevant past interactions.',
    relatedCardIds: ['rc-marl-8.2-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.2-2',
    lessonId: 'marl-8.2',
    question: 'On-policy algorithms like REINFORCE have an advantage over off-policy methods in MARL because they always learn from the most up-to-date policies of other agents.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'On-policy algorithms compute the policy gradient based on the most recent experiences generated by the agents\' current policies. As policies evolve, the collected experiences immediately reflect changes in other agents\' behaviors.',
    relatedCardIds: ['rc-marl-8.2-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.2-3',
    lessonId: 'marl-8.2',
    question: 'In IDQN, each agent trains its own action-value function Q(.; theta_i), maintains a replay buffer D_i, and learns only from its own observation history, actions, and _____.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'rewards',
    explanation: 'In IDQN, each agent independently trains its own DQN using only its local observation history, actions, and rewards, without access to the observations, actions, or rewards of other agents.',
    relatedCardIds: ['rc-marl-8.2-3'],
    order: 3,
  },

  // --- Lesson 8.3: Centralized Critics (MADDPG/MAPPO) ---
  {
    id: 'quiz-marl-8.3-1',
    lessonId: 'marl-8.3',
    question: 'In the CTDE paradigm, what is the minimum input a centralized critic should be conditioned on?',
    type: 'multiple-choice',
    options: [
      'Only the environment state s',
      'Only the current observation of the agent',
      'The agent\'s observation history, to avoid bias from having less information than the actor',
      'The joint action of all agents',
    ],
    correctAnswer: 'The agent\'s observation history, to avoid bias from having less information than the actor',
    explanation: 'Lyu et al. (2023) showed that at a minimum, the critic should be conditioned on the agent\'s observation history (the policy\'s input). Without it, the critic may be biased since it has less information than the actor itself.',
    relatedCardIds: ['rc-marl-8.3-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.3-2',
    lessonId: 'marl-8.3',
    question: 'A centralized critic is needed during execution to help agents select actions after training is complete.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Once training is completed, the critic network is no longer utilized. The actor alone generates agent actions during execution, which is why the actor only needs local observations while the critic can use centralized information.',
    relatedCardIds: ['rc-marl-8.3-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.3-3',
    lessonId: 'marl-8.3',
    question: 'A critic is called _____ if it is conditioned on any information beyond the individual observation and action history of the agent.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'centralized',
    explanation: 'A centralized critic conditions on additional information such as the observation histories of all agents, the full environment state, or other privileged data beyond what the individual agent can observe.',
    relatedCardIds: ['rc-marl-8.3-3'],
    order: 3,
  },

  // --- Lesson 8.4: COMA ---
  {
    id: 'quiz-marl-8.4-1',
    lessonId: 'marl-8.4',
    question: 'What is the key idea behind COMA\'s counterfactual baseline?',
    type: 'multiple-choice',
    options: [
      'It compares the agent\'s reward to the average reward across all agents',
      'It marginalizes out the action of agent i while holding other agents\' actions fixed to estimate advantage',
      'It uses a separate neural network to predict what would happen in alternative scenarios',
      'It removes the agent from the environment to measure its contribution',
    ],
    correctAnswer: 'It marginalizes out the action of agent i while holding other agents\' actions fixed to estimate advantage',
    explanation: 'COMA\'s counterfactual baseline computes the expected value when agent i follows its policy while other agents\' actions are fixed, and subtracts this from the actual action value to estimate agent i\'s specific advantage.',
    relatedCardIds: ['rc-marl-8.4-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.4-2',
    lessonId: 'marl-8.4',
    question: 'COMA has been shown to consistently outperform all other multi-agent policy gradient methods in practice.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Despite its clear motivation, COMA empirically suffers from high variance in its baseline and inconsistent value estimates, which result in unstable training that can lead to poor performance.',
    relatedCardIds: ['rc-marl-8.4-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.4-3',
    lessonId: 'marl-8.4',
    question: 'COMA uses the concept of the aristocrat utility, which measures the expected _____ reward when the default action is sampled from the current policy.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'difference',
    explanation: 'The aristocrat utility computes the expected difference reward where the default action is sampled from the current policy, providing an indication of whether action ai leads to better or worse rewards than average.',
    relatedCardIds: ['rc-marl-8.4-3'],
    order: 3,
  },

  // --- Lesson 8.5: VDN/QMIX ---
  {
    id: 'quiz-marl-8.5-1',
    lessonId: 'marl-8.5',
    question: 'What does the Individual-Global-Max (IGM) property ensure in value decomposition?',
    type: 'multiple-choice',
    options: [
      'That each agent\'s utility function converges to the same values',
      'That greedy actions with respect to individual utilities produce the greedy joint action for the centralized value function',
      'That the decomposition always produces the exact centralized values',
      'That agents can communicate to coordinate their action selection',
    ],
    correctAnswer: 'That greedy actions with respect to individual utilities produce the greedy joint action for the centralized value function',
    explanation: 'The IGM property states that the greedy joint action with respect to the centralized action-value function equals the joint action composed of each agent\'s individually greedy action maximizing their utility, enabling decentralized action selection.',
    relatedCardIds: ['rc-marl-8.5-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.5-2',
    lessonId: 'marl-8.5',
    question: 'VDN (Value Decomposition Networks) decomposes the centralized action-value function as a simple sum of individual agent utility functions.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'VDN assumes a linear decomposition where the centralized action-value function equals the sum of individual utility functions: Q(h,z,a) = sum of Q_i(h_i, a_i). This simple assumption satisfies the IGM property.',
    relatedCardIds: ['rc-marl-8.5-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.5-3',
    lessonId: 'marl-8.5',
    question: 'QMIX ensures the IGM property by enforcing _____ of the centralized action-value function with respect to individual utilities.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'monotonicity',
    explanation: 'QMIX ensures the IGM property by requiring that the centralized action-value function is monotonically increasing with respect to each agent\'s individual utility, meaning an increase in any agent\'s utility leads to an increase in the joint value.',
    relatedCardIds: ['rc-marl-8.5-3'],
    order: 3,
  },

  // --- Lesson 8.6: Value Decomposition Extensions ---
  {
    id: 'quiz-marl-8.6-1',
    lessonId: 'marl-8.6',
    question: 'How does QMIX\'s mixing network ensure monotonicity with respect to individual agent utilities?',
    type: 'multiple-choice',
    options: [
      'By using only ReLU activation functions',
      'By constraining the mixing network to have only positive weights for utility inputs using a hypernetwork with absolute value activations',
      'By sorting the utilities before combining them',
      'By normalizing all utility values to be between 0 and 1',
    ],
    correctAnswer: 'By constraining the mixing network to have only positive weights for utility inputs using a hypernetwork with absolute value activations',
    explanation: 'QMIX uses a hypernetwork that outputs the mixing network parameters, applying an absolute value function to ensure positive weights for utility inputs, thereby guaranteeing monotonicity of the mixing function.',
    relatedCardIds: ['rc-marl-8.6-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.6-2',
    lessonId: 'marl-8.6',
    question: 'Any centralized action-value function that can be represented by VDN can also be represented by QMIX.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'The monotonicity assumption of QMIX subsumes the linearity assumption of VDN, so the set of centralized action-value functions representable by QMIX is a superset of those representable by VDN.',
    relatedCardIds: ['rc-marl-8.6-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.6-3',
    lessonId: 'marl-8.6',
    question: 'In QMIX, the parameters of the mixing network are produced by a separate _____ that receives centralized information as input.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'hypernetwork',
    explanation: 'QMIX uses a hypernetwork that takes centralized information as input and outputs the parameters of the mixing network, allowing the mixing to depend on global state information.',
    relatedCardIds: ['rc-marl-8.6-3'],
    order: 3,
  },

  // --- Lesson 8.7: Neural Agent Models ---
  {
    id: 'quiz-marl-8.7-1',
    lessonId: 'marl-8.7',
    question: 'In deep MARL, what is the primary purpose of training neural agent models?',
    type: 'multiple-choice',
    options: [
      'To replace the environment simulator',
      'To learn representations of other agents\' policies from observed behavior to inform decision-making',
      'To compress the observation space for faster processing',
      'To generate synthetic training data for data augmentation',
    ],
    correctAnswer: 'To learn representations of other agents\' policies from observed behavior to inform decision-making',
    explanation: 'Neural agent models extend the classical concept of agent modeling (Section 6.3) with deep learning, learning representations of other agents\' policies that can be used to predict their actions and inform the learning agent\'s decisions.',
    relatedCardIds: ['rc-marl-8.7-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.7-2',
    lessonId: 'marl-8.7',
    question: 'Agent modeling in deep MARL can only be done using policy reconstruction from observed actions.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'While policy reconstruction from observed actions is the most common approach, agent modeling encompasses many different methodologies including learning representations of agent policies, goal inference, and more.',
    relatedCardIds: ['rc-marl-8.7-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.7-3',
    lessonId: 'marl-8.7',
    question: 'Learning models of other agents\' policies from their observed past state-action pairs can be framed as a _____ learning problem.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'supervised',
    explanation: 'Policy reconstruction can be framed as a supervised learning problem using past observed state-action pairs of the modeled agent, fitting a parameterized model to predict actions given states.',
    relatedCardIds: ['rc-marl-8.7-3'],
    order: 3,
  },

  // --- Lesson 8.8: Parameter Sharing ---
  {
    id: 'quiz-marl-8.8-1',
    lessonId: 'marl-8.8',
    question: 'When is parameter sharing in MARL most appropriate?',
    type: 'multiple-choice',
    options: [
      'When agents have completely different observation and action spaces',
      'When agents are homogeneous with identical observation and action spaces',
      'When agents compete against each other in a zero-sum game',
      'When agents need to specialize in different roles',
    ],
    correctAnswer: 'When agents are homogeneous with identical observation and action spaces',
    explanation: 'Parameter sharing is particularly useful in environments with homogeneous agents that have the same observation and action spaces, allowing a single shared network for all agents, improving sample efficiency.',
    relatedCardIds: ['rc-marl-8.8-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.8-2',
    lessonId: 'marl-8.8',
    question: 'In QMIX\'s original implementation, individual agent utility networks are shared across agents with an additional one-hot encoded agent ID as input.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'The original QMIX implementation shares utility network parameters across agents (theta_i = theta_j for all i,j) and provides a one-hot encoded agent ID as additional input to allow different utility functions despite parameter sharing.',
    relatedCardIds: ['rc-marl-8.8-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.8-3',
    lessonId: 'marl-8.8',
    question: 'Parameter sharing reduces the total number of learnable parameters by having all agents use a single shared _____ instead of separate ones.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'network',
    explanation: 'With parameter sharing, instead of creating separate networks for each agent, a single shared network is used. All agents\' inputs are processed through the same network, drastically reducing the number of parameters to learn.',
    relatedCardIds: ['rc-marl-8.8-3'],
    order: 3,
  },

  // --- Lesson 8.9: AlphaZero ---
  {
    id: 'quiz-marl-8.9-1',
    lessonId: 'marl-8.9',
    question: 'What is the core training paradigm behind AlphaZero?',
    type: 'multiple-choice',
    options: [
      'Supervised learning from expert human games',
      'Self-play combined with Monte Carlo tree search and deep neural networks',
      'Independent reinforcement learning with random opponents',
      'Population-based training with multiple competing agents',
    ],
    correctAnswer: 'Self-play combined with Monte Carlo tree search and deep neural networks',
    explanation: 'AlphaZero combines self-play (a single agent trained against copies of its own policy) with Monte Carlo tree search (MCTS) guided by deep neural networks that predict both policy and value.',
    relatedCardIds: ['rc-marl-8.9-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.9-2',
    lessonId: 'marl-8.9',
    question: 'In self-play, a single agent is trained to play a zero-sum game by playing against copies of its own policy.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Self-play trains a single agent by having it play against copies of its own (possibly historical) policy. This paradigm has been core to several MARL breakthroughs in competitive board- and video-game playing.',
    relatedCardIds: ['rc-marl-8.9-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.9-3',
    lessonId: 'marl-8.9',
    question: 'MCTS stands for Monte Carlo _____ Search, a planning algorithm that builds a search tree of future states and actions.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'tree',
    explanation: 'Monte Carlo Tree Search (MCTS) builds a search tree of possible future states and actions, using random simulations (rollouts) to evaluate the quality of different action sequences.',
    relatedCardIds: ['rc-marl-8.9-3'],
    order: 3,
  },

  // --- Lesson 8.10: PSRO / AlphaStar ---
  {
    id: 'quiz-marl-8.10-1',
    lessonId: 'marl-8.10',
    question: 'What is the main idea behind Policy Space Response Oracles (PSRO)?',
    type: 'multiple-choice',
    options: [
      'Training all agents simultaneously with a shared reward function',
      'Iteratively expanding a population of policies by computing best responses and using meta-game analysis',
      'Learning a single optimal policy through curriculum learning',
      'Using random policy initialization to explore the strategy space',
    ],
    correctAnswer: 'Iteratively expanding a population of policies by computing best responses and using meta-game analysis',
    explanation: 'PSRO iteratively expands a population of policies by training new best-response policies against existing ones, then using meta-game analysis (solving a normal-form game over the policy population) to determine which policies to respond to.',
    relatedCardIds: ['rc-marl-8.10-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-8.10-2',
    lessonId: 'marl-8.10',
    question: 'AlphaStar achieved grandmaster level in the full game of StarCraft II by combining self-play with population-based training.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'AlphaStar reached grandmaster level in StarCraft II by extending self-play to general-sum settings through population-based training, training populations of agents to play against each other.',
    relatedCardIds: ['rc-marl-8.10-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-8.10-3',
    lessonId: 'marl-8.10',
    question: 'PSRO extends fictitious play by using deep RL to compute approximate best _____ to the current meta-strategy.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'responses',
    explanation: 'PSRO can be seen as a deep learning extension of fictitious play. Instead of computing exact best responses, PSRO uses deep RL to train approximate best response policies against the current mixture of policies in the population.',
    relatedCardIds: ['rc-marl-8.10-3'],
    order: 3,
  },

  // =============================================
  // MODULE 9: MARL in Practice (marl-9.1 to marl-9.4)
  // =============================================

  // --- Lesson 9.1: PettingZoo ---
  {
    id: 'quiz-marl-9.1-1',
    lessonId: 'marl-9.1',
    question: 'Which interface does PettingZoo provide for multi-agent environments?',
    type: 'multiple-choice',
    options: [
      'A custom TCP/IP protocol for distributed agents',
      'A unified representation and agent-environment interface compatible with the Gym-style API',
      'A specialized C++ library for high-performance simulation',
      'An interface exclusively designed for Atari games',
    ],
    correctAnswer: 'A unified representation and agent-environment interface compatible with the Gym-style API',
    explanation: 'PettingZoo is an environment collection that provides a unified representation and agent-environment interface, compatible with the standard Gym-style API (reset/step functions), for a variety of multi-agent environments.',
    relatedCardIds: ['rc-marl-9.1-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-9.1-2',
    lessonId: 'marl-9.1',
    question: 'All multi-agent environments use exactly the same agent-environment interface.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Unlike single-agent RL with its standard Gym interface, MARL does not have a fully unified interface. Different frameworks use different environment interfaces, and wrappers are often needed for compatibility.',
    relatedCardIds: ['rc-marl-9.1-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-9.1-3',
    lessonId: 'marl-9.1',
    question: 'The standard agent-environment interface has two main functions: reset() to initialize the environment and _____() to advance by one time step.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'step',
    explanation: 'The general interface has two main functions: reset() initializes the environment and returns initial observations, and step() advances the environment by one time step given the agents\' joint actions, returning observations, rewards, and termination signals.',
    relatedCardIds: ['rc-marl-9.1-3'],
    order: 3,
  },

  // --- Lesson 9.2: Implementation Tips ---
  {
    id: 'quiz-marl-9.2-1',
    lessonId: 'marl-9.2',
    question: 'Why is reward standardization useful in MARL implementation?',
    type: 'multiple-choice',
    options: [
      'It guarantees faster convergence to an optimal policy',
      'It helps neural networks approximate rewards that span many orders of magnitude',
      'It removes the need for exploration strategies',
      'It makes all agents receive the same rewards',
    ],
    correctAnswer: 'It helps neural networks approximate rewards that span many orders of magnitude',
    explanation: 'Many MARL environments have rewards spanning many orders of magnitude, which hinders neural networks\' ability to approximate them. Standardizing rewards to mean zero and unit standard deviation can improve training efficiency.',
    relatedCardIds: ['rc-marl-9.2-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-9.2-2',
    lessonId: 'marl-9.2',
    question: 'Using a separate optimizer for each agent is always more efficient than using a single centralized optimizer.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Using a single optimizer encompassing all trainable parameters is often significantly faster than separate optimizers because it enables better parallelization. The individual losses can simply be summed before the gradient descent step.',
    relatedCardIds: ['rc-marl-9.2-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-9.2-3',
    lessonId: 'marl-9.2',
    question: 'In partially observable environments, a _____ neural network can be used to process sequences of observations and maintain memory of past inputs.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'recurrent',
    explanation: 'When information from previous observations is important for decisions, a recurrent neural network (like LSTM or GRU) can process the observation sequence and maintain a hidden state as memory of past inputs.',
    relatedCardIds: ['rc-marl-9.2-3'],
    order: 3,
  },

  // --- Lesson 9.3: Presenting Results ---
  {
    id: 'quiz-marl-9.3-1',
    lessonId: 'marl-9.3',
    question: 'Why are learning curves in zero-sum games often uninformative?',
    type: 'multiple-choice',
    options: [
      'Zero-sum games are too simple for learning curves to be meaningful',
      'The returns of co-training agents may balance out, showing no clear improvement for either agent',
      'Zero-sum games do not have measurable rewards',
      'Learning curves can only display positive values',
    ],
    correctAnswer: 'The returns of co-training agents may balance out, showing no clear improvement for either agent',
    explanation: 'In zero-sum games, both agents may improve during training, but since they are trained against each other, the learning curves may show no clear progress. A static heuristic opponent can be used instead for evaluation.',
    relatedCardIds: ['rc-marl-9.3-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-9.3-2',
    lessonId: 'marl-9.3',
    question: 'A fair comparison between MARL algorithms requires that all algorithms undergo an equally thorough hyperparameter search.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'MARL is especially sensitive to hyperparameters. A comparison where one algorithm had a larger hyperparameter search is unfair. Equal search effort ensures differences reflect algorithmic capabilities rather than tuning effort.',
    relatedCardIds: ['rc-marl-9.3-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-9.3-3',
    lessonId: 'marl-9.3',
    question: 'When condensing learning curves into a single number, the _____ value indicates whether an algorithm at any point solved the environment.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'maximum',
    explanation: 'The maximum value of the learning curve indicates whether the algorithm achieved the desired behavior at any point during training, while the average value captures learning speed and stability.',
    relatedCardIds: ['rc-marl-9.3-3'],
    order: 3,
  },

  // --- Lesson 9.4: Environment Survey ---
  {
    id: 'quiz-marl-9.4-1',
    lessonId: 'marl-9.4',
    question: 'What makes the StarCraft Multi-Agent Challenge (SMAC) particularly suited for testing value decomposition methods?',
    type: 'multiple-choice',
    options: [
      'It has fully observable states for all agents',
      'It uses common rewards across all agents, making credit assignment challenging',
      'It has a small number of possible actions',
      'It provides pre-trained baseline agents',
    ],
    correctAnswer: 'It uses common rewards across all agents, making credit assignment challenging',
    explanation: 'SMAC uses common rewards based on damage dealt and enemies defeated, making the credit assignment problem prominent since it is difficult to disentangle each agent\'s contribution. This makes value decomposition methods particularly suitable.',
    relatedCardIds: ['rc-marl-9.4-1'],
    order: 1,
  },
  {
    id: 'quiz-marl-9.4-2',
    lessonId: 'marl-9.4',
    question: 'In the level-based foraging (LBF) environment, agents can always collect any item individually without help from other agents.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'In LBF, an item can only be collected if the sum of the collecting agents\' levels meets or exceeds the item\'s level. Many items require cooperation between multiple agents, especially in forced cooperation tasks.',
    relatedCardIds: ['rc-marl-9.4-2'],
    order: 2,
  },
  {
    id: 'quiz-marl-9.4-3',
    lessonId: 'marl-9.4',
    question: 'In the Hanabi card game, each player cannot see their own cards but can see the cards of all other players, which is a form of _____ observability.',
    type: 'fill-blank',
    options: [],
    correctAnswer: 'partial',
    explanation: 'Hanabi features a unique form of partial observability where each player sees other players\' cards but not their own, requiring agents to develop communication conventions using limited hint actions.',
    relatedCardIds: ['rc-marl-9.4-3'],
    order: 3,
  },
];

/** Quiz questions indexed by lesson ID for efficient lookup. */
export const quizQuestionsByLesson: Record<string, QuizQuestion[]> = {};
for (const q of quizQuestions) {
  if (!quizQuestionsByLesson[q.lessonId]) {
    quizQuestionsByLesson[q.lessonId] = [];
  }
  quizQuestionsByLesson[q.lessonId].push(q);
}
