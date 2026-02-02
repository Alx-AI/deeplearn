/**
 * Lesson 8.7: Agent Modeling with Neural Networks
 *
 * Covers: Neural opponent models, supervised opponent modelling, recursive reasoning
 * Source sections: 9.6
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-8.7',
  title: 'Agent Modeling with Neural Networks',
  sections: [
    {
      id: 'marl-8.7.1',
      title: 'Neural Opponent Models and Joint-Action Learning',
      content: `
The algorithms we have seen so far only consider other agents' actions *indirectly* -- through training data or centralized critics. **Agent modeling** takes a more direct approach: each agent learns an explicit model of what other agents will do, and uses that model to make better decisions.

In tabular MARL, agent modeling was limited to tracking empirical action distributions in visited states. With neural networks, we can **generalize** agent models to states we have never seen. Each agent i maintains neural network models hat{pi}_j^i for each other agent j, where hat{pi}_j^i(a_j | h_i ; phi_j^i) predicts agent j's action distribution based on what agent i has observed.

These models are trained via **supervised learning** during training, when agents' actual actions are visible. The loss is a simple cross-entropy:

L(phi_j^i) = -log hat{pi}_j^i(a_j^t | h_i^t ; phi_j^i)

This maximizes the likelihood of the agent model predicting the true action agent j took, given agent i's observation history. Note that we condition on agent *i's* observation history (not agent j's), because at execution time agent i only has access to its own observations.

To use these models for decision-making, each agent i trains a centralized action-value function Q(h_i, <a_i, a_{-i}> ; theta_i) that takes all agents' actions as input. At execution time, agent i does not know what others will do, so it uses its agent models to compute an **expected action value**:

AV(h_i, a_i ; theta_i) = sum_{a_{-i}} Q(h_i, <a_i, a_{-i}> ; theta_i) * product_{j != i} hat{pi}_j^i(a_j | h_i)

Agent i then selects the action that maximizes this expected value. When enumerating all joint actions is intractable, the expectation can be approximated by sampling K joint actions from the agent models and averaging.

Experiments in level-based foraging show that this **joint-action learning with agent models (JAL-AM)** outperforms IDQN in tasks requiring cooperation. Interestingly, the sampled version (K=10) often learns faster and more reliably than the exact version, likely because the sampling introduces helpful noise and prioritizes common actions.
`,
      reviewCardIds: ['rc-marl-8.7-1', 'rc-marl-8.7-2'],
      illustrations: [],
    },
    {
      id: 'marl-8.7.2',
      title: 'Learning Compact Representations of Agent Policies',
      content: `
Directly predicting other agents' action probabilities works, but there is a more flexible approach: learn a **compact representation** of other agents' policies and condition your own policy and value function on it.

The idea uses an **encoder-decoder** architecture. An encoder network f^e takes agent i's observation history as input and produces a compact representation vector m_i^t = f^e(h_i^t ; psi_e_i). A decoder network f^d takes this representation and predicts the action probabilities of all other agents: hat{pi}_{-i}^{i,t} = f^d(m_i^t ; psi_d_i).

The encoder and decoder are trained jointly with a cross-entropy loss:

L(psi_e_i, psi_d_i) = sum_{j != i} -log hat{pi}_j^{i,t}(a_j^t)

where the decoder's prediction is hat{pi}_j^{i,t} = f^d(f^e(h_i^t ; psi_e_i) ; psi_d_i).

The magic is in the representation m_i^t. By forcing the encoder to compress all information relevant to predicting other agents' actions into a fixed-size vector, the encoder learns a **compact summary of other agents' behavioral patterns**. This representation can then be fed as additional input to agent i's policy and value functions:

pi(. | h_i, m_i ; phi_i) and V(h_i, z, m_i ; theta_i)

This approach is **algorithm-agnostic** -- any MARL algorithm can be extended with it. For example, extending centralized A2C simply means conditioning the actor on (h_i, m_i) and the critic on (h_i, z, m_i).

An important implementation detail: gradients from the MARL training objective are **stopped** from flowing back into the encoder. The encoder is trained purely from the reconstruction loss, keeping the two learning signals independent.

In level-based foraging experiments, centralized A2C with representation-based agent models learns faster and converges to higher, more consistent returns than the same algorithm without agent models. The representations help agents anticipate what their partners will do, enabling more effective coordination.
`,
      reviewCardIds: ['rc-marl-8.7-3', 'rc-marl-8.7-4'],
      illustrations: [],
    },
    {
      id: 'marl-8.7.3',
      title: 'Recursive Reasoning and Opponent Shaping',
      content: `
Agent modeling answers the question "what will other agents do?" But we can go deeper. **Recursive reasoning** asks: "what do other agents *think I will do*, and how does that affect their behavior?"

Humans naturally engage in recursive reasoning -- "I think that she thinks that I will go left, so she will go right, so I should go left after all." This is the concept of **theory of mind** (Premack and Woodruff 1978) applied to multi-agent decision-making.

The **probabilistic recursive reasoning framework** (Wen et al. 2019) formalizes this for MARL. Agents maintain beliefs about other agents' policies and reason about how their own actions will affect those beliefs. The framework uses **Bayesian variational inference** to model the uncertainty in these beliefs. Beliefs are recursively propagated -- agent i's belief about agent j's belief about agent i -- and integrated into fully decentralized actor-critic or value-based algorithms.

**Opponent shaping** takes an even more aggressive stance: if agent i knows how agent j is learning (its optimization objective or update rule), then agent i can compute **higher-order gradients** through agent j's learning process. This allows agent i to choose actions not just for immediate reward, but to *influence how agent j's policy evolves* -- effectively "teaching" or "manipulating" the other agent.

Foerster et al. (2018) and Letcher et al. (2019) implement this idea in deep RL by differentiating through the learning updates of other agents. More broadly, this can be viewed as a **meta-learning** problem with an "inner loop" (all agents learning policies) and an "outer loop" (agent i optimizing its strategy considering the inner loop dynamics).

Similar encoder-decoder approaches have been applied to settings where a main agent interacts with fixed agents sampled from a predetermined set (Rabinowitz et al. 2018; Papoudakis et al. 2021; Zintgraf et al. 2021). Beyond policy reconstruction, these works propose predicting other agents' observations or "mental states" -- what information other agents might have -- as a richer signal for the encoder.

These advanced forms of agent modeling represent the frontier of multi-agent reasoning, but they come with significant computational costs and assumptions (such as knowing other agents' learning algorithms) that limit their current practical applicability.
`,
      reviewCardIds: ['rc-marl-8.7-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Agent modeling trains neural networks to predict other agents' actions from an agent's own observations, enabling generalization to unseen states.
- Joint-action learning with agent models (JAL-AM) trains a centralized action-value function and uses agent models to compute expected action values at execution time.
- Encoder-decoder architectures learn compact representations of other agents' policies; these representations are fed as additional inputs to the agent's own policy and value function.
- Gradients from the MARL training are stopped from flowing into the encoder, keeping reconstruction and policy optimization independent.
- Recursive reasoning extends agent modeling to consider what other agents think about you; opponent shaping uses higher-order gradients to influence how other agents learn.
- The sampling-based approximation for JAL-AM (sampling K joint actions) often outperforms exact computation due to helpful noise and focus on likely actions.`,
};

export default lesson;
