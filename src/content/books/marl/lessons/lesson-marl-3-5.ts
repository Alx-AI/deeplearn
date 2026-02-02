/**
 * Lesson 3.5: Communication and Knowledge in Games
 *
 * Covers: Explicit vs implicit communication, common knowledge,
 *         information asymmetry
 * Source sections: 3.5, 3.6
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-3.5',
  title: 'Communication and Knowledge in Games',
  sections: [
    {
      id: 'marl-3.5.1',
      title: 'Modeling Communication',
      content: `Agents in the real world do not just act on the environment -- they also *talk* to each other. A search-and-rescue robot might broadcast its position; a self-driving car might signal a lane change. The game models we have seen are general enough to capture this. The key idea is to split each agent's action space into two parts:

A_i = X_i x M_i

where X_i is the set of **environment actions** (e.g., move, collect) and M_i is the set of **communication actions** (messages). At every time step, agent i simultaneously chooses an environment action and a message. The environment action affects the state; the communication action does not. Formally, the transition function is independent of the message component: T(s' | s, a) depends only on the environment actions, not the messages.

In a **stochastic game**, every agent observes the previous joint action a^{t-1}, which includes all agents' messages. So communication is automatic and perfect -- every message reaches every agent. In a **POSG**, communication can be more nuanced because the observation function O_i controls what each agent actually perceives. This allows us to model:

- **Noisy communication:** A continuous-valued message m_j is received as m_j + eta, where eta is Gaussian noise.
- **Message loss:** With some probability, the received message is replaced by the empty symbol, modelling unreliable channels.
- **Limited range:** If agents i and j are farther apart than a threshold, agent i's observation does not include j's message.

Communications are **ephemeral** -- each message lasts only one time step. However, since agents can access their observation history, they can in principle remember every message they have ever received.`,
      reviewCardIds: ['rc-marl-3.5-1', 'rc-marl-3.5-2'],
      illustrations: [],
    },
    {
      id: 'marl-3.5.2',
      title: 'Learning to Communicate',
      content: `An important subtlety in the MARL setting is that agents do not start out knowing what messages *mean*. In RL, the standard assumption is that agents have no prior knowledge of their action spaces -- including the communication actions in M_i. Each message is just an abstract symbol or vector, no different from any environment action.

This means agents must learn *two things simultaneously*: how to send useful messages and how to interpret messages from others. Over the course of training, agents can develop a shared **communication protocol** -- an emergent language whose "meaning" arises purely from the reward signal. This is one of the most fascinating areas in MARL research: studies have shown that agents can learn to refer to objects, coordinate plans, and even develop compositional message structures, all without any hand-designed language.

In the level-based foraging example, M_i might contain one message per grid location. An agent could learn to use a message to tell teammates where a high-value item is located, or to announce its intended destination to avoid conflicts. But none of this is pre-programmed. The agent discovers that sending a particular message in a particular context leads to higher long-term reward -- and its teammates learn to respond appropriately.

The algorithms we study in later chapters are general: they learn policies over the full action set A_i = X_i x M_i, treating communication actions on equal footing with environment actions. Some specialised algorithms (such as CommNet and DIAL, discussed later) add architectural biases that make communication learning easier, but the fundamental principle is the same: communication is just another action whose value must be discovered through experience.`,
      reviewCardIds: ['rc-marl-3.5-3'],
      illustrations: [],
    },
    {
      id: 'marl-3.5.3',
      title: 'Knowledge Assumptions and Information Asymmetry',
      content: `What does an agent know about the game it is playing? In classical game theory, the standard assumption is **complete knowledge**: every agent knows the full specification of the game -- all action spaces, all reward functions, the transition function, and the observation functions. This is a strong assumption. If agent i knows agent j's reward function R_j, it can reason about j's incentives and predict j's likely behaviour.

MARL operates at the opposite extreme. The standard assumption in MARL is **incomplete knowledge**: agents do not know the reward functions of other agents (or even their own), nor the state transition function, nor the observation functions. Instead, each agent i only experiences the immediate effects of its actions -- its own reward r_i^t and its own observation o_i^{t+1}. Agents must learn about the world through trial and error, using these experiences to build implicit models of the environment and other agents.

Between complete and incomplete knowledge lie important intermediate assumptions:

- **Symmetric vs. asymmetric knowledge:** Do all agents have access to the same information, or do some agents know things others do not?
- **Common knowledge:** Not only does every agent know a fact, but every agent knows that every other agent knows it, and that everyone knows that everyone knows it, ad infinitum. Common knowledge is a surprisingly strong condition and is rarely achievable in practice.

In most MARL research, these fine-grained distinctions receive less attention because the default assumption is maximal ignorance. Notable exceptions arise in zero-sum and common-reward games, where the reward structure is sometimes assumed to be known and is exploited by specialised algorithms. We will encounter several such algorithms in Chapters 6 and 9.

Finally, it is typically assumed that the number of agents is fixed and known. Recent research has begun to relax this, studying **open multi-agent environments** where agents may dynamically enter and leave.`,
      reviewCardIds: ['rc-marl-3.5-4', 'rc-marl-3.5-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Communication is modeled by splitting actions into environment actions and message actions; messages do not affect the state but can be observed by other agents.
- POSGs can model noisy, unreliable, and range-limited communication through the observation function.
- In MARL, agents do not know what messages mean a priori -- they must learn to send and interpret messages through experience, potentially developing emergent communication protocols.
- Classical game theory assumes complete knowledge of all game components; MARL typically assumes incomplete knowledge, where agents learn from their own rewards and observations.
- Common knowledge (everyone knows that everyone knows, etc.) is a strong condition rarely met in practice.`,
};

export default lesson;
