/**
 * Lesson 8.1: Training and Execution Modes (CTDE)
 *
 * Covers: CTDE paradigm, centralized vs decentralized vs CTDE, training vs execution info
 * Source sections: 9.1, 9.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-8.1',
  title: 'Training and Execution Modes (CTDE)',
  sections: [
    {
      id: 'marl-8.1.1',
      title: 'The CTDE Paradigm',
      content: `
Before diving into the deep MARL algorithms that power modern multi-agent systems, we need to answer a fundamental design question: **what information is available during training versus execution?** The answer profoundly shapes every algorithm we will encounter in this module.

MARL algorithms can be categorized along two axes. First, during **training**, the algorithm may be restricted to only local information observed by each agent ("decentralized training") or it might leverage information about all agents in the system ("centralized training"). Second, during **execution** -- when trained agents are actually deployed -- each agent's policy may only use its own local observation history ("decentralized execution") or may access information from all agents ("centralized execution").

The combination that dominates modern deep MARL is **centralized training with decentralized execution (CTDE)**. Under CTDE, algorithms exploit shared information during training -- joint observations, global state, other agents' actions -- to produce better learning signals. But the resulting policies are designed so each agent only needs its own local observations to select actions at deployment time.

Why is CTDE so popular? Consider a multi-agent actor-critic algorithm. During training, you can give the **critic** access to the observations and actions of all agents, producing more accurate value estimates. This centralized critic can see how agent 2's movement affects agent 1's expected returns, for instance. But the **actor** (the policy) is conditioned only on the individual agent's observation history. Once training ends, you throw away the critic and deploy just the actors -- each agent independently selects actions based on what it personally observes. No communication channel needed.

This paradigm will be the backbone of multi-agent policy gradient methods, value decomposition, and agent modeling approaches throughout this module.
`,
      reviewCardIds: ['rc-marl-8.1-1', 'rc-marl-8.1-2'],
      illustrations: [],
    },
    {
      id: 'marl-8.1.2',
      title: 'Centralized vs Decentralized Training and Execution',
      content: `
Let us compare the three main paradigms more carefully.

**Centralized training and execution** uses shared information for both learning and acting. An example is **central learning**, which reduces the multi-agent game to a single-agent problem: one central policy observes the joint-observation history of all agents and outputs a joint action. The benefit is full information -- the value function can condition on everything. The drawbacks are severe: (1) the joint-action space grows exponentially with the number of agents, (2) combining individual rewards into a single signal may be impossible in general-sum games, and (3) physically distributed agents (autonomous vehicles, for example) may not be able to transmit all sensor data to a central controller in real time.

**Decentralized training and execution** sits at the opposite extreme. Each agent trains and acts using only its own local information. No centralized sharing of observations, values, or policies occurs at any stage. This is the natural setting for scenarios like financial markets, where trading firms cannot observe each other's strategies. Independent learning (Section 5.3.2 in the book) is the canonical example. Its benefits are scalability and applicability to distributed settings. Its drawbacks include non-stationarity -- from each agent's perspective, the environment shifts as other agents update their policies -- and the inability to leverage information about other agents even when it would help.

**CTDE** captures the best of both worlds. During centralized training, agents can share observations, actions, and even full environment state to produce better learning signals. During decentralized execution, each agent's policy depends only on its own observation history. This makes CTDE particularly powerful for deep MARL: approximate value functions can be conditioned on **privileged information** during training, then discarded once policies are learned.

The tradeoff is not free, however. Centralized information can increase variance in policy gradient estimates even while reducing bias, and critics that receive too much extraneous input may struggle to learn useful representations.
`,
      reviewCardIds: ['rc-marl-8.1-3', 'rc-marl-8.1-4'],
      illustrations: [],
    },
    {
      id: 'marl-8.1.3',
      title: 'Notation and Information During Training vs Execution',
      content: `
To keep algorithms precise, the book introduces notation that distinguishes what agents see during training versus execution.

The parameters of agent $i$'s **policy** and **value function** are denoted $\\phi_i$ and $\\theta_i$, respectively. The policy is written as $\\pi(\\cdot \\;; \\phi_i)$, the value function as $V(\\cdot \\;; \\theta_i)$, and the action-value function as $Q(\\cdot \\;; \\theta_i)$. When the parameterization makes the agent identity clear, the subscript $i$ is dropped.

In partially observable games (POSGs), each agent $i$ receives a local observation $o_i^t$ at each time step. The **local observation history** of agent $i$ up to time $t$ is $h_i^t = (o_i^0, o_i^1, \\ldots, o_i^t)$. The **joint-observation history** is $h^t = (o^0, o^1, \\ldots, o^t)$ where $o^t$ contains the observations of all agents. The full environment state $s^t$ may also be available during centralized training.

The key distinction for CTDE algorithms is:

- **Execution:** The policy $\\pi(a_i \\mid h_i^t \\;; \\phi_i)$ is conditioned only on agent $i$'s local observation history. This ensures decentralized execution -- the agent needs nothing beyond what it personally observes.

- **Training:** Value functions and critics can be conditioned on **centralized information** $z$, which may include the observation histories of all agents, the full state, or any other shared data. A centralized critic might look like $V(h_i^t, z^t \\;; \\theta_i)$.

In practice, agents often use **recurrent neural networks** (GRUs or LSTMs) to process their observation histories. The RNN maintains a hidden state that summarizes past observations, so the agent does not need to store and re-process the entire history at each step. Many publications simplify notation by conditioning on just the latest observation $o^t$, but the underlying models process the full history through their hidden states.

This asymmetry between training and execution information is what enables every CTDE algorithm we will study: the critic sees more than the actor during training, but only the actor is needed at deployment.
`,
      reviewCardIds: ['rc-marl-8.1-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- MARL algorithms are categorized by information available during training (centralized vs decentralized) and execution (centralized vs decentralized).
- Centralized training with decentralized execution (CTDE) is the dominant paradigm in deep MARL: critics access shared information during training, but policies depend only on local observations for execution.
- Centralized training and execution suffers from exponential joint-action spaces and communication requirements; fully decentralized training suffers from non-stationarity and information loss.
- Notation distinguishes agent policy parameters ($\\phi_i$), value parameters ($\\theta_i$), local observation histories ($h_i^t$), and centralized information ($z^t$).
- Recurrent networks are commonly used to process observation histories, enabling agents to condition on history without explicit storage.`,
};

export default lesson;
