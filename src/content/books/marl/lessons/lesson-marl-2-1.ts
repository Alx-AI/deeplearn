import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-2.1',
  title: 'The RL Problem: Agents and Environments',
  sections: [
    {
      id: 'marl-2.1.1',
      title: 'The Agent-Environment Loop',
      content: `
**Reinforcement learning** (RL) is a type of machine learning in which algorithms learn solutions for sequential decision processes via repeated interaction with an environment. This definition immediately raises three fundamental questions: What is a sequential decision process? What counts as a solution? And what does "learning via repeated interaction" actually mean?

A **sequential decision process** is defined by an agent that makes decisions over multiple time steps within an environment to achieve a specified goal. The core mechanic is a loop: at each time step, the agent receives an **observation** from the environment, selects an **action**, and then the environment responds by transitioning to a new state and sending back a scalar **reward** signal. This agent-environment loop repeats, step after step, forming the backbone of every RL problem.

In a **fully observable** setting -- which is our focus in this chapter -- the agent can see the complete state of the environment. In more general settings, observations may be incomplete or noisy, leading to partially observable problems (POMDPs). But even in the fully observable case, the agent's challenge is far from trivial: a particular action might yield a low immediate reward yet lead to states from which the agent can eventually collect much larger rewards. This tension between short-term and long-term consequences is what makes RL genuinely different from simpler prediction tasks.

RL occupies a unique position among the branches of machine learning. It is not **supervised learning**, because the reward signal does not directly tell the agent which action is correct -- it only provides a scalar score. And it is not **unsupervised learning**, because the rewards, while imperfect, do provide a meaningful signal from which to learn an optimal strategy. RL is its own paradigm: learning by doing, one interaction at a time.
`,
      reviewCardIds: ['rc-marl-2.1-1', 'rc-marl-2.1-2'],
      illustrations: [],
    },
    {
      id: 'marl-2.1.2',
      title: 'Observations, Actions, and Rewards',
      content: `
Let's unpack the three quantities that flow through the agent-environment loop at every time step.

**Observations** (or states, in the fully observable case) represent the current situation of the environment. In a board game, this might be the positions of all pieces. In a robotics task, it could be joint angles and sensor readings. The critical assumption for this chapter is full observability: the agent perceives the entire state s_t at each time step t, with nothing hidden.

**Actions** are the decisions the agent can make. The set of available actions, A, may be the same in every state or may depend on the current state. Actions can be discrete (turn left, turn right, go straight) or continuous (apply 3.7 Newtons of force). A **policy**, denoted pi, is the agent's decision-making strategy: given a state s_t, the policy pi(a | s_t) assigns a probability to each possible action. Deterministic policies assign probability 1 to a single action, while **stochastic policies** spread probability across multiple actions.

**Rewards** are scalar signals r_t that the environment sends back after the agent takes an action. The reward function R(s_t, a_t, s_{t+1}) depends on the current state, the chosen action, and the resulting next state. Rewards encode the goal: a Mars rover might receive +10 for reaching the base station and -10 for falling off a cliff. The fundamental assumption of RL is that whatever objective we care about can be expressed as the maximization of cumulative reward over time.

The **solution** to an RL problem is an **optimal policy** pi* that selects actions in each state to maximize the expected cumulative reward. Note the word "expected" -- because transitions and policies may be stochastic, the agent cannot guarantee a specific outcome in every episode. It can only maximize its average performance across the randomness inherent in the process.

A central challenge that arises from this setup is the **exploration-exploitation dilemma**: should the agent stick with actions it already believes are good (exploit), or try new actions to discover potentially better strategies (explore)? Exploration may discover superior actions but can accrue low rewards in the process, while exploitation achieves a certain level of return but may never find the truly optimal behavior.
`,
      reviewCardIds: ['rc-marl-2.1-3', 'rc-marl-2.1-4'],
      illustrations: [],
    },
    {
      id: 'marl-2.1.3',
      title: 'Episodes and Tasks',
      content: `
RL problems come in two broad flavors based on whether the interaction naturally ends.

An **episode** is a single, independent run of the agent-environment loop from some initial state to a terminal condition. Think of one game of chess, one delivery route, or one attempt at navigating a maze. Each episode begins with an initial state s_0 sampled from an **initial state distribution** mu and proceeds until the environment reaches a **terminal state** (from the set of terminal states S-bar) or a maximum number of time steps T is reached. Once an episode ends, the environment resets and a new episode begins. Problems with this structure are called **episodic tasks**.

In contrast, **continuing tasks** have no natural endpoint -- the agent-environment interaction goes on indefinitely. A thermostat controlling room temperature or a trading agent operating in a financial market are examples of continuing tasks. As we will see shortly, continuing tasks require special care when defining cumulative rewards, since the naive sum of rewards over an infinite horizon can diverge to infinity.

The book's treatment unifies episodic and continuing tasks through the concept of **absorbing states**. When an episode reaches a terminal state or exhausts its time budget, we treat the final state as absorbing: any action from an absorbing state transitions the environment back to itself with probability 1 and produces zero reward. This means the agent is effectively "stuck" with no further reward, and the infinite-horizon mathematics work cleanly even for tasks that really do terminate.

This unification is more than a notational trick -- it lets us write a single set of equations that covers both episodic and continuing settings. We will use this convention throughout the chapter when we define returns, value functions, and the Bellman equations. Every RL problem introduced in the MARL chapters ahead will build on these foundational ideas: an agent, an environment, a policy, and an objective defined over episodes or continuing interactions.
`,
      reviewCardIds: ['rc-marl-2.1-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- RL algorithms learn by repeated interaction with an environment through an agent-environment loop of observations, actions, and rewards.
- A policy pi(a | s) maps states to action probabilities; the goal is to find an optimal policy that maximizes expected cumulative reward.
- Episodic tasks terminate in a finite number of steps; continuing tasks run indefinitely. Absorbing states unify both settings.
- The exploration-exploitation dilemma -- balancing discovery of new actions against leveraging known good ones -- is a central challenge in RL.
- RL is distinct from supervised and unsupervised learning: reward signals guide but do not directly specify the correct action.`,
};

export default lesson;
