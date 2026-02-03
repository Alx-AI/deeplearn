/**
 * Lesson 5.5: Credit Assignment and Scaling
 *
 * Covers: The multi-agent credit assignment problem, lazy agent and relative
 * overgeneralisation, scalability challenges
 * Source sections: 5.4.3, 5.4.4
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-5.5',
  title: 'Credit Assignment and Scaling',
  sections: [
    {
      id: 'marl-5.5.1',
      title: 'The Multi-Agent Credit Assignment Problem',
      content: `
In single-agent RL, **temporal credit assignment** asks: which of my past actions contributed to this reward? Multi-agent RL adds a second, orthogonal question: **whose actions** among multiple agents contributed to the reward? This is the **multi-agent credit assignment** problem, and it is one of the most persistent challenges in MARL.

Consider the Level-Based Foraging example from the textbook. Three agents are on a grid. Two agents are adjacent to a high-level item and simultaneously choose "collect," while a third agent is far away and also happens to choose "collect." All three receive a shared reward of +1. From a learning algorithm's perspective, *all three agents' collect actions are reinforced equally*. But we know that the third agent's action contributed nothing -- it was too far from the item and its level was too low. Worse, the third agent's previous movement actions that brought it to its useless position are also implicitly credited for the reward through temporal credit assignment.

This problem is especially acute in **common-reward** settings where all agents receive identical rewards. The shared reward is applied indiscriminately to every agent, leaving it to the learning algorithm to disentangle who actually contributed. But even without common rewards, the problem persists. If only the two cooperating agents receive +1, they still need to understand that it was their *joint* collect action -- not either agent's individual action -- that produced the reward.

One approach to resolving credit assignment is to use **joint-action value functions** $Q(s, a_1, \\ldots, a_n)$, as in Central Q-Learning. By assigning values to *combinations* of actions, the algorithm can distinguish cases like (Rock, Scissors) from (Rock, Paper) and correctly attribute value to each agent's contribution. Joint-action values also enable **counterfactual reasoning**: "What reward would I have received if agent j had done X instead of Y?" This idea underlies **difference rewards**, which measure each agent's marginal contribution by comparing the actual outcome to a counterfactual where the agent takes a "default" action.
`,
      reviewCardIds: ['rc-marl-5.5-1', 'rc-marl-5.5-2'],
      illustrations: [],
    },
    {
      id: 'marl-5.5.2',
      title: 'Lazy Agents and Relative Overgeneralisation',
      content: `
Failed credit assignment produces characteristic pathologies in multi-agent learning. Two of the most important are the **lazy agent** problem and **relative overgeneralisation**.

The **lazy agent** problem occurs when one agent learns to "free-ride" on the contributions of others. If a team of agents receives a common reward whenever *any* subset of them succeeds, an individual agent can learn that its own actions barely affect the reward -- because the other agents are doing the work. The lazy agent's policy converges to a passive "noop" strategy. In Level-Based Foraging, this might manifest as one agent standing still while the other two collect all items. The lazy agent still receives positive reward (because it is a common-reward game) and has no gradient pushing it toward useful behavior.

**Relative overgeneralisation** is a subtler failure mode. It occurs when an agent learns to prefer an action that is *broadly acceptable* across many possible partner strategies, rather than the action that is *optimal* when partners also play optimally. Suppose Agent 1 can choose action A (optimal only if Agent 2 also plays A) or action B (decent regardless of Agent 2's action). During early learning, when Agent 2's policy is essentially random, action B gives more consistent returns. Agent 1 learns to prefer B, which in turn makes Agent 2 less likely to encounter the high-reward (A, A) outcome, reinforcing the suboptimal cycle. The agents converge to a mediocre joint policy because each agent's value estimate is "overgeneralized" across the *distribution* of partner behaviors rather than focused on the optimal partner behavior.

Both pathologies stem from the same root cause: agents cannot distinguish their own contributions from those of others. The field addresses these issues through techniques like **value function decomposition** -- methods such as QMIX and VDN that learn to factorize a joint value function into per-agent components in a way that preserves correct credit assignment. We will encounter these methods in later chapters.
`,
      reviewCardIds: ['rc-marl-5.5-3', 'rc-marl-5.5-4'],
      illustrations: [],
    },
    {
      id: 'marl-5.5.3',
      title: 'Scalability Challenges',
      content: `
Scaling MARL to many agents is fundamentally difficult because of the **exponential growth** of the joint-action space. The number of joint actions is $|\\mathbf{A}| = |A_1| \\times |A_2| \\times \\ldots \\times |A_n|$. In Level-Based Foraging with 6 actions per agent, going from 3 agents to 5 agents increases the joint space from 216 to 7,776 actions. If the agents also contribute features to the state (like positions), the state space $|S|$ grows exponentially too.

This exponential growth affects different MARL approaches in different ways:

**Algorithms using joint-action values** -- like Central Q-Learning and joint-action learning methods -- face exponential growth in the space needed to represent $Q(s, \\mathbf{a})$ as well as the number of observations needed to adequately estimate values for all joint actions. Every additional agent multiplies the table size by $|A_i|$.

**Independent learning algorithms** avoid the joint-action value table, but they are not immune. More agents mean more sources of non-stationarity, since each additional agent's changing policy adds another "moving part" to every other agent's perceived environment. Credit assignment also gets harder with more agents, as each additional agent is another potential cause for any observed reward.

The textbook makes an important nuance: exponential growth is not always unique to MARL. Consider a power plant with 1,000 control variables, each taking $k$ values. Whether we use one central controller (facing $k^{1000}$ actions) or decompose into $n$ agents (each facing $k^{1000/n}$ actions), the total joint-action space remains $k^{1000}$. Factoring the problem into agents does not magically shrink the problem -- it redistributes the complexity.

Still, scaling efficiently with $n$ is a core goal of MARL research. Part II of the textbook introduces **deep learning** techniques as one path to improved scalability, using function approximation to generalize across the vast joint-action space rather than enumerating it explicitly. Architectures like parameter sharing (where all agents use the same neural network), attention mechanisms, and mean-field approximations are among the tools developed to tackle this challenge.
`,
      reviewCardIds: ['rc-marl-5.5-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Multi-agent credit assignment asks whose actions contributed to a received reward, compounding the temporal credit assignment problem from single-agent RL.
- In common-reward settings, rewards are applied indiscriminately to all agents, making it especially hard to disentangle individual contributions.
- The lazy agent problem arises when an agent learns to free-ride on others' contributions; relative overgeneralisation occurs when agents prefer broadly acceptable actions over jointly optimal ones.
- Joint-action value functions and value function decomposition (e.g., QMIX, VDN) are key approaches to resolving multi-agent credit assignment.
- The joint-action space grows exponentially with the number of agents, affecting both centralized methods (table size) and independent methods (increased non-stationarity and harder credit assignment).`,
};

export default lesson;
