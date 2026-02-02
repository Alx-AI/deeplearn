import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-2.2',
  title: 'Markov Decision Processes',
  sections: [
    {
      id: 'marl-2.2.1',
      title: 'The MDP Tuple: S, A, T, R, and gamma',
      content: `
The **Markov decision process** (MDP) is the standard mathematical model used in RL to formally define a sequential decision process. A finite MDP is specified by five components:

1. **S** -- a finite set of states, with a subset of terminal states S-bar (a subset of S).
2. **A** -- a finite set of actions available to the agent.
3. **T : S x A x S -> [0, 1]** -- the **state transition probability function**. T(s, a, s') gives the probability of transitioning to state s' when the agent takes action a in state s. For every state-action pair, these probabilities must sum to 1 over all possible next states: sum over s' of T(s, a, s') = 1.
4. **R : S x A x S -> R** -- the **reward function**. R(s, a, s') returns a scalar reward received when the agent takes action a in state s and the environment transitions to s'.
5. **mu : S -> [0, 1]** -- the **initial state distribution**, specifying the probability of starting in each state. Terminal states have zero probability under mu.

An MDP episode unfolds as follows. An initial state s_0 is sampled from mu. At each time step t, the agent observes state s_t and selects an action a_t according to its policy pi(a_t | s_t). The environment then transitions to state s_{t+1} with probability T(s_{t+1} | s_t, a_t), and the agent receives reward r_t = R(s_t, a_t, s_{t+1}). This loop repeats until a terminal state is reached, a maximum number of time steps T elapses, or (in non-terminating MDPs) indefinitely.

A concrete example helps ground this abstraction. Consider a **Mars Rover MDP** in which a rover must return to its base station after collecting samples. The state set S includes Start, Site A, Site B, Base, Immobile, and Destroyed. From each non-terminal state, the rover can choose between actions "left" and "right." Each action leads to a successor state with an associated transition probability and reward -- for instance, going right from Start reaches Base with probability 0.5 (reward +10) but also risks destruction with probability 0.5 (reward -10). The transition function T and reward function R together encode the full dynamics of this decision problem.
`,
      reviewCardIds: ['rc-marl-2.2-1', 'rc-marl-2.2-2'],
      illustrations: [],
    },
    {
      id: 'marl-2.2.2',
      title: 'The Markov Property',
      content: `
The "Markov" in Markov Decision Process refers to a powerful simplifying assumption known as the **Markov property**. Formally, it states:

Pr(s_{t+1}, r_t | s_t, a_t, s_{t-1}, a_{t-1}, ..., s_0, a_0) = Pr(s_{t+1}, r_t | s_t, a_t)

In plain language: the future state and reward depend only on the current state and action, not on any of the history that led to the current state. The present state "screens off" the past. This property dramatically simplifies the mathematics -- we do not need to maintain or reason about the full trajectory of past states and actions.

The Markov property is both a mathematical convenience and a modeling assumption. For many problems, it holds naturally: in a board game like chess, the current board configuration contains everything you need to decide the best next move -- how you arrived at that configuration is irrelevant. In other problems, you might need to **design** the state representation carefully so that it contains enough information for the Markov property to hold. For example, in a navigation task, simply knowing the agent's position might not suffice; you might also need to include velocity.

The practical consequence is profound: because optimal decisions depend only on the current state, the agent's policy can be written as pi(a | s) -- a mapping from the current state to action probabilities, with no dependence on history. This is what makes tabular methods (storing a value for every state or state-action pair) tractable. Without the Markov property, an optimal policy would need to consider the entire history of observations and actions, making the problem exponentially harder.

It is worth noting that when the Markov property does not hold -- for instance, when the agent receives only partial observations of the true environment state -- we enter the territory of **partially observable MDPs** (POMDPs). POMDPs generalize MDPs by introducing an observation function, and the agent must reason over a *belief* about possible underlying states. POMDPs are a special case of the partially observable stochastic game model that will be introduced in Chapter 3.
`,
      reviewCardIds: ['rc-marl-2.2-3', 'rc-marl-2.2-4'],
      illustrations: [],
    },
    {
      id: 'marl-2.2.3',
      title: 'Deterministic vs. Stochastic Transitions',
      content: `
MDP transitions can be **deterministic** or **stochastic**, and the distinction matters both conceptually and algorithmically.

In a **deterministic MDP**, every state-action pair leads to exactly one successor state with probability 1. If the rover chooses "right" in state Site A, it always ends up in the same next state. Formally, for every (s, a), there exists a unique s' such that T(s' | s, a) = 1 and T(s'' | s, a) = 0 for all s'' not equal to s'. Deterministic MDPs are simpler to analyze because there is no uncertainty in the transitions -- the only source of variability is the agent's own (possibly stochastic) policy.

In a **stochastic MDP**, taking the same action in the same state can lead to different outcomes. In the Mars Rover example, choosing "right" from the Start state leads to the Base with probability 0.5 but also leads to destruction with probability 0.5. The agent cannot control which outcome occurs -- it can only control its choice of action. This stochasticity is why RL focuses on *expected* returns rather than guaranteed returns: the agent optimizes its average performance over the randomness in transitions.

Note that the reward function R(s, a, s') as defined here is deterministic -- given a specific (s, a, s') triple, the reward is a fixed scalar. However, MDPs can also be defined with **probabilistic reward functions** where R(s, a, s') specifies a distribution over rewards rather than a single value. In practice, even with a deterministic reward function, the fact that s' is drawn stochastically means the agent faces uncertainty about which reward it will actually receive after choosing an action.

Beyond finite, discrete MDPs, one can also define MDPs with **continuous** state or action spaces (or a mixture of both). A self-driving car, for example, has continuous state variables (position, velocity, steering angle) and continuous actions (throttle, brake, steering). The mathematical framework generalizes naturally, though the algorithms required differ substantially. In this chapter, we focus on the finite MDP setting, which provides the clearest path to understanding value functions, Bellman equations, and the core algorithms that MARL builds upon.

Finally, an important special case of the MDP is the **multi-armed bandit problem**, in which there is only a single state, each episode lasts exactly one time step, and the reward function is stochastic and unknown. Bandit problems isolate the exploration-exploitation dilemma in its purest form and have been studied extensively as a foundational model in decision theory.
`,
      reviewCardIds: ['rc-marl-2.2-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- An MDP is defined by a tuple (S, A, T, R, mu): states, actions, transition probabilities, rewards, and an initial state distribution.
- The Markov property states that the future depends only on the current state and action, not on the history -- enabling policies that are functions of state alone.
- Deterministic MDPs have unique successor states for each state-action pair; stochastic MDPs have probabilistic transitions, requiring the agent to maximize expected returns.
- POMDPs generalize MDPs to settings where the agent receives partial or noisy observations.
- The multi-armed bandit is a special single-state, single-step MDP that isolates the exploration-exploitation trade-off.`,
};

export default lesson;
