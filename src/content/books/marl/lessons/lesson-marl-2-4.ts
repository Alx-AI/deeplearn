import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-2.4',
  title: 'Value Functions and the Bellman Equation',
  sections: [
    {
      id: 'marl-2.4.1',
      title: 'State-Value Function V^pi',
      content: `
**Value functions** are the central analytical tool in RL. They assign a numerical "value" to each state (or state-action pair) that captures how good it is for the agent to be in that state under a given policy. This section introduces the state-value function; the next section covers the action-value function.

Given a policy $\\pi$, the **state-value function** $V^{\\pi}(s)$ gives the expected discounted return when starting in state $s$ and following policy $\\pi$ to select all subsequent actions:

$$V^{\\pi}(s) = \\mathbb{E}_{\\pi}[G_t \\mid s_t = s] = \\mathbb{E}_{\\pi}[r_t + \\gamma \\cdot r_{t+1} + \\gamma^2 \\cdot r_{t+2} + \\ldots \\mid s_t = s]$$

By convention, $V^{\\pi}(s) = 0$ for any terminal (absorbing) state, since no further rewards are collected.

The beauty of $V^{\\pi}$ lies in the Markov property: because the future depends only on the current state and action, the value of every state can be defined independently. We do not need to know how the agent arrived at state $s$ -- only that it is there now and will follow $\\pi$ going forward.

Consider the Mars Rover example with a policy that chooses "right" with probability 1 in the Start state. Running iterative policy evaluation yields $V^{\\pi}(\\text{Start}) = 0$, which makes intuitive sense: the expected reward is $0.5 \\cdot (+10) + 0.5 \\cdot (-10) = 0$. With a different policy that randomizes equally between "left" and "right" in Start and always goes "right" in Site A and Site B, we get $V^{\\pi}(\\text{Start}) = 2.05$, $V^{\\pi}(\\text{Site A}) = 6.2$, and $V^{\\pi}(\\text{Site B}) = 10$. The state-value function gives us a complete picture of how well the agent does from every state, enabling systematic comparison of policies.

An important practical point: $V^{\\pi}$ on its own is not enough to directly improve the policy. To decide which action is best in a given state, we need to know the value of taking each possible action -- which requires either the full MDP model ($T$ and $R$) or the action-value function $Q^{\\pi}$, introduced next.
`,
      reviewCardIds: ['rc-marl-2.4-1', 'rc-marl-2.4-2'],
      illustrations: [],
    },
    {
      id: 'marl-2.4.2',
      title: 'Action-Value Function Q^pi',
      content: `
While $V^{\\pi}$ tells us the value of being in a state, the **action-value function** $Q^{\\pi}(s, a)$ tells us the value of taking a specific action $a$ in state $s$ and then following policy $\\pi$ for all subsequent decisions:

$$Q^{\\pi}(s, a) = \\mathbb{E}_{\\pi}[G_t \\mid s_t = s, a_t = a]$$

The relationship between $V^{\\pi}$ and $Q^{\\pi}$ is straightforward. The state-value is simply the expectation of $Q^{\\pi}$ over actions chosen by the policy:

$$V^{\\pi}(s) = \\sum_{a \\in \\mathcal{A}} \\pi(a \\mid s) \\cdot Q^{\\pi}(s, a)$$

Conversely, $Q^{\\pi}$ can be expressed in terms of $V^{\\pi}$ by expanding one step of the dynamics:

$$Q^{\\pi}(s, a) = \\sum_{s' \\in \\mathcal{S}} T(s' \\mid s, a) \\cdot [R(s, a, s') + \\gamma \\cdot V^{\\pi}(s')]$$

This equation says: take action $a$, average over all possible successor states $s'$ weighted by their transition probabilities, and for each successor, add the immediate reward to the discounted value of being in $s'$ under $\\pi$.

The action-value function is especially important for **policy improvement**. If we know $Q^{\\pi}(s, a)$ for all state-action pairs, we can immediately construct a better policy by acting greedily: in each state, pick the action with the highest $Q^{\\pi}$ value. This is much more convenient than using $V^{\\pi}$ alone, which would require knowledge of the transition function $T$ and reward function $R$ to evaluate each action's consequences.

This convenience is why many RL algorithms -- including Q-learning and Sarsa, which we will encounter later -- learn Q-functions rather than V-functions. Once you have a good estimate of $Q^*$, the optimal policy is just $\\arg\\max_a Q^*(s, a)$, no model of the environment needed. The action-value function is the practical workhorse of model-free RL.

As with $V^{\\pi}$, the action-value $Q^{\\pi}(s, a) = 0$ for terminal states $s \\in \\bar{S}$. Both $V^{\\pi}$ and $Q^{\\pi}$ are uniquely determined by the policy $\\pi$ and the MDP dynamics.
`,
      reviewCardIds: ['rc-marl-2.4-3', 'rc-marl-2.4-4'],
      illustrations: [],
    },
    {
      id: 'marl-2.4.3',
      title: 'Bellman Equations: Expectation and Optimality',
      content: `
The recursive structure of the discounted return -- $G_t = r_t + \\gamma \\cdot G_{t+1}$ -- gives rise to the most important equations in RL: the **Bellman equations**.

The **Bellman expectation equation** for $V^{\\pi}$ expresses the value of a state as the expected immediate reward plus the discounted value of the successor state:

$$V^{\\pi}(s) = \\sum_{a \\in \\mathcal{A}} \\pi(a \\mid s) \\sum_{s' \\in \\mathcal{S}} T(s' \\mid s, a) \\cdot [R(s, a, s') + \\gamma \\cdot V^{\\pi}(s')]$$

This equation holds simultaneously for every state $s \\in \\mathcal{S}$. For a finite MDP with $m = |\\mathcal{S}|$ states, it defines a system of $m$ linear equations in $m$ unknowns (the values $V^{\\pi}(s_1), \\ldots, V^{\\pi}(s_m)$). Since everything else -- $\\pi$, $T$, $R$, $\\gamma$ -- is known, this system has a unique solution. One could solve it by Gaussian elimination in $O(m^3)$ time, though iterative methods are more common in practice.

Similarly, the **Bellman expectation equation** for $Q^{\\pi}$ is:

$$Q^{\\pi}(s, a) = \\sum_{s' \\in \\mathcal{S}} T(s' \\mid s, a) \\cdot [R(s, a, s') + \\gamma \\sum_{a' \\in \\mathcal{A}} \\pi(a' \\mid s') \\cdot Q^{\\pi}(s', a')]$$

Now, the **Bellman optimality equations** characterize the optimal value functions $V^*$ and $Q^*$ without reference to any specific policy:

$$V^*(s) = \\max_{a \\in \\mathcal{A}} \\sum_{s' \\in \\mathcal{S}} T(s' \\mid s, a) \\cdot [R(s, a, s') + \\gamma \\cdot V^*(s')]$$

$$Q^*(s, a) = \\sum_{s' \\in \\mathcal{S}} T(s' \\mid s, a) \\cdot [R(s, a, s') + \\gamma \\cdot \\max_{a' \\in \\mathcal{A}} Q^*(s', a')]$$

The key difference is the **max operator**, which makes these equations nonlinear. Instead of averaging over actions via $\\pi$, the optimality equations select the best action. This system of $m$ nonlinear equations also has a unique solution -- the optimal value function -- but it cannot be solved by standard linear algebra. Instead, we need iterative algorithms like value iteration (covered in the next lesson) that repeatedly apply these equations as update operators until convergence.

The Bellman equations are the engine that drives virtually every RL algorithm. Dynamic programming uses them directly with known models. Temporal-difference methods approximate them from sampled experience. Even modern deep RL algorithms at their core are approximating solutions to these equations. Understanding them deeply is the single most important step toward mastering RL and, ultimately, multi-agent RL.
`,
      reviewCardIds: ['rc-marl-2.4-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- $V^{\\pi}(s)$ gives the expected discounted return from state $s$ under policy $\\pi$; $Q^{\\pi}(s, a)$ gives the expected return after taking action $a$ in state $s$ then following $\\pi$.
- $V^{\\pi}$ and $Q^{\\pi}$ are related: $V^{\\pi}(s) = \\sum_a \\pi(a \\mid s) \\cdot Q^{\\pi}(s, a)$, and $Q^{\\pi}$ can be expanded using $V^{\\pi}$ and the transition model.
- The Bellman expectation equations define a system of linear equations for $V^{\\pi}$ (or $Q^{\\pi}$) that has a unique solution.
- The Bellman optimality equations introduce a max operator, making them nonlinear, and their unique solution is $V^*$ (or $Q^*$).
- Knowing $Q^*$ yields the optimal policy directly via argmax -- no model of the environment is needed.`,
};

export default lesson;
