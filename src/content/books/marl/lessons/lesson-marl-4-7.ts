/**
 * Lesson 4.7: No-Regret Learning
 *
 * Covers: External regret, no-regret property, connection to CCE
 * Source sections: 4.10
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-4.7',
  title: 'No-Regret Learning',
  sections: [
    {
      id: 'marl-4.7.1',
      title: 'External Regret: Comparing Against the Best Fixed Action',
      content: `The equilibrium concepts we have studied so far are all defined in terms of a single joint policy -- they describe a static configuration of mutual best responses. **No-regret** is a fundamentally different kind of solution concept: it considers an agent's performance *across multiple episodes* of play and asks whether the agent could have done better in hindsight.

Let $a^e$ denote the joint action from episode $e = 1, \\ldots, z$. Agent $i$'s **(external) regret** for not having played the best single action across all episodes is:

$$\\text{Regret}^z_i = \\max_{a_i} \\sum_{e=1}^{z} \\left[ R_i(a_i, a^e_{-i}) - R_i(a^e) \\right]$$

This measures the gap between the total reward agent $i$ actually received and the total reward it *would have* received had it played the single best action $a_i$ in every episode, keeping the other agents' actions fixed as they actually occurred. The "best single action" is determined with full hindsight -- you look back at all $z$ episodes and find which constant action would have been best.

An agent has **no-regret** if its average regret vanishes as the number of episodes grows:

$$\\lim_{z \\to \\infty} \\frac{1}{z} \\text{Regret}^z_i \\leq 0$$

As a solution concept, **no-regret** requires that *all* agents achieve no-regret simultaneously. Similar to $\\epsilon$-Nash, we can define **$\\epsilon$-no-regret** by requiring that the limit is at most $\\epsilon > 0$ rather than zero.

The name "external regret" distinguishes this from other regret variants. It is "external" because we compare against the best constant replacement for the agent's *entire* action sequence. This is the most common and simplest notion of regret, and it forms the basis for powerful algorithmic results that connect learning dynamics to equilibrium concepts.`,
      reviewCardIds: ['rc-marl-4.7-1', 'rc-marl-4.7-2'],
      illustrations: [],
    },
    {
      id: 'marl-4.7.2',
      title: 'A Concrete Example and the No-Regret Property',
      content: `Let us trace through a concrete example to build intuition. Consider ten episodes of two agents in the Prisoner's Dilemma:

| Episode | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---------|---|---|---|---|---|---|---|---|---|---|
| Agent 1 | C | C | D | C | D | D | C | D | D | D |
| Agent 2 | C | D | C | D | D | D | C | C | D | C |

Agent 1's total reward across these episodes is -21. If agent 1 had always played C (keeping agent 2's actions fixed), the total would have been -30. If agent 1 had always played D, the total would have been -15. So the best constant action is D, and agent 1's regret is -15 - (-21) = 6, giving an average regret of 0.6 per episode.

This makes sense: in Prisoner's Dilemma, D is a dominant action. Agent 1 played C in some episodes when D would have been better, so it has positive regret. For agent 1 to achieve no-regret, it would need to play D more consistently as episodes continue, driving the average regret toward zero.

No-regret is an attractive solution concept because it is a **prescriptive** property -- it describes how agents should behave *during learning*, not just the static outcome. Equilibrium concepts are **descriptive**: they characterize desirable endpoints. No-regret bridges the gap by saying "an agent's learning process is good if, in hindsight, the agent has no regret."

However, no-regret has a key conceptual limitation: it assumes the other agents' actions remain as they actually occurred. If agent 1 had actually played D in every episode, agent 2 would likely have responded differently. Regret does not account for this counterfactual adaptation. So minimizing regret does not necessarily maximize returns when opponents are adaptive -- a point we saw similarly with equilibria in the Prisoner's Dilemma.`,
      reviewCardIds: ['rc-marl-4.7-3', 'rc-marl-4.7-4'],
      illustrations: [],
    },
    {
      id: 'marl-4.7.3',
      title: 'Connection Between No-Regret and Equilibria',
      content: `Despite its simplicity, no-regret has deep and elegant connections to equilibrium concepts. These connections are among the most important theoretical results in MARL:

**No external regret implies convergence to coarse correlated equilibrium.** In any general-sum normal-form game, if all agents use no-external-regret learning algorithms, the empirical distribution of joint actions (the average frequency of each joint action across episodes) converges to the set of coarse correlated equilibria (CCE). This is a remarkable result: agents learning independently, each only trying to minimize their own regret, collectively produce behavior that converges to an equilibrium concept.

**No internal regret implies convergence to correlated equilibrium.** Internal (or conditional) regret is a stronger notion than external regret. Rather than replacing the agent's *entire* action sequence with a single action, internal regret considers replacing every occurrence of a specific action $a'_i$ with a different action $a_i$. If all agents have no internal regret, the empirical distribution of joint actions converges to the set of correlated equilibria (CE), which is a stricter subset than CCE.

**In two-agent zero-sum games, no external regret implies convergence to minimax.** The empirical joint action distribution of no-external-regret learners converges to the set of minimax solutions. This is the theoretical foundation for algorithms like multiplicative weights and regret matching in zero-sum games.

These results (Hart and Mas-Colell, 2000; Young, 2004) provide a powerful bridge between the learning dynamics perspective (how agents update their policies over time) and the equilibrium perspective (what static outcome is reached). They tell us that regret minimization algorithms are not just individually rational -- they collectively produce socially meaningful outcomes.

For sequential-move games, regret generalizes from actions to policies. Agent $i$'s regret is measured against the best policy from a finite policy space, keeping the other agents' policies fixed as observed. The same convergence results extend with appropriate modifications.`,
      reviewCardIds: ['rc-marl-4.7-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- **External regret** measures the gap between an agent's total reward and the reward it would have received from the best single constant action in hindsight.
- An agent achieves **no-regret** if its average regret vanishes over infinitely many episodes. As a solution concept, no-regret requires this for all agents.
- No-regret is **prescriptive** (describes good learning behavior) rather than descriptive (describes a static outcome), bridging learning dynamics and equilibrium theory.
- Key convergence results: no external regret implies convergence to **CCE**; no internal regret implies convergence to **CE**; in zero-sum games, no external regret implies convergence to **minimax**.
- Limitation: regret assumes other agents' actions are fixed, which does not hold when opponents adapt.`,
};

export default lesson;
