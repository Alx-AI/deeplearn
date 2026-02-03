/**
 * Lesson 6.9: Regret Matching and No-Regret Learning
 *
 * Covers: Regret matching algorithm, CFR, poker solving (Libratus/Pluribus)
 * Source sections: 6.5
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.9',
  title: 'Regret Matching and No-Regret Learning',
  sections: [
    {
      id: 'marl-6.9.1',
      title: 'Unconditional and Conditional Regret Matching',
      content: `
We have seen algorithms that target Nash equilibrium (JAL-GT, WoLF) and algorithms that target best responses (fictitious play, JAL-AM). Now we turn to a different solution concept: **no-regret**. Rather than asking "am I playing an equilibrium?", a no-regret learner asks "am I doing as well as I could have done with any single fixed action, in hindsight?"

**Regret matching** (Hart and Mas-Colell 2000) is a remarkably simple algorithm that achieves no-regret. It comes in two flavors:

**Unconditional regret matching.** After $z$ episodes with joint actions $a^1, \\ldots, a^z$, agent $i$'s unconditional regret for not having always played action $a_i$ is:

$$\\text{Regret}^z_i(a_i) = \\sum_{e=1}^{z} \\bigl[R_i(a_i, a^e_{-i}) - R_i(a^e)\\bigr]$$

This asks: "How much better off would I have been if I had played $a_i$ in every episode, while the opponents played the same actions they actually did?" The average regret is $\\bar{R}^z_i(a_i) = (1/z) \\cdot \\text{Regret}^z_i(a_i)$. The policy assigns probability proportional to positive average regrets:

$$\\pi^{z+1}_i(a_i) = \\frac{[\\bar{R}^z_i(a_i)]^+}{\\sum_{a'_i} [\\bar{R}^z_i(a'_i)]^+}$$

where $[x]^+ = \\max(x, 0)$. If all regrets are non-positive, any distribution may be used.

**Conditional regret matching** refines this by conditioning on the agent's most recent action $a^z_i$. It asks: "Given that I played $a'_i$, how much better would $a_i$ have been in those specific episodes?" The conditional regret for switching from $a'_i$ to $a_i$ is:

$$\\text{Regret}^z_i(a'_i, a_i) = \\sum_{e:\\, a^e_i = a'_i} \\bigl[R_i(a_i, a^e_{-i}) - R_i(a^e)\\bigr]$$

The policy update biases toward actions with high conditional regret relative to the most recent action, controlled by a parameter $\\eta$.
`,
      reviewCardIds: ['rc-marl-6.9-1', 'rc-marl-6.9-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.9.2',
      title: 'Convergence to Correlated Equilibria',
      content: `
Both types of regret matching guarantee that average regrets converge to zero at a rate of $O(1/\\sqrt{z})$, regardless of what other agents do. This follows from Blackwell's **Approachability Theorem** (1956).

What does zero regret imply for the joint behavior of the agents? The answer connects beautifully to correlated equilibrium:

**Unconditional regret matching** -- when all agents use it, the **empirical distribution of joint actions** converges to the set of **coarse correlated equilibria**. Recall that coarse correlated equilibrium requires that no agent benefits from deviating to a fixed alternative action before learning the recommended action.

**Conditional regret matching** -- when all agents use it, the empirical distribution converges to the set of **correlated equilibria** (the stronger concept). This is because conditional regret exactly matches the deviation incentive structure in the definition of correlated equilibrium.

In **Rock-Paper-Scissors**, the behavior is striking. The actual policies $\\pi^z_i$ of the agents bounce chaotically around the probability simplex -- at any given episode, an agent might put 80% on Rock or 90% on Scissors. Yet the **empirical distributions** (what fraction of the time each action was played historically) converge steadily to the Nash equilibrium (1/3, 1/3, 1/3). Looking at the average regrets, they oscillate around zero in a swinging pattern: agent 1 shifts to high-regret actions, causing agent 2's regrets to shift, which feeds back, creating perpetual oscillations that cancel out on average.

An important contrast with WoLF-PHC: WoLF-PHC achieves **policy convergence** (the policies themselves converge to Nash equilibrium), which is strictly stronger than the **empirical convergence** achieved by regret matching. In regret matching, the policies never settle down -- only their long-run averages converge.
`,
      reviewCardIds: ['rc-marl-6.9-3', 'rc-marl-6.9-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.9.3',
      title: 'Counterfactual Regret Minimization and Poker',
      content: `
Regret matching as defined above applies to normal-form games. To scale it to large **sequential** games (extensive-form games), Zinkevich et al. (2007) developed **Counterfactual Regret Minimization (CFR)**. CFR decomposes the global regret minimization problem into local regret minimization problems at each information set (decision point) in the game tree. Each information set maintains its own regret-matching policy, and the local no-regret guarantees combine to yield a global no-regret guarantee.

CFR's impact on **poker** has been transformative. The algorithm (and its variants) produced the first superhuman poker AIs:

**Libratus** (Brown and Sandholm 2018) defeated top professional players in heads-up no-limit Texas Hold'em, a game with approximately $10^{161}$ information sets. Libratus used a combination of: (1) CFR-based blueprint strategy computation, (2) real-time subgame solving to refine the strategy during play, and (3) a self-improvement module that identified and patched exploitable aspects of the strategy.

**Pluribus** (Brown and Sandholm 2019) extended this success to **six-player** no-limit Hold'em -- a much harder setting because there are multiple opponents who may collude or play unpredictably. Pluribus used a modified CFR algorithm to compute a blueprint strategy via self-play, then applied real-time search during actual play.

The connection between regret matching and these achievements is direct. CFR's convergence guarantee (empirical strategies converge to Nash equilibrium in two-player zero-sum games) provides the theoretical foundation. In multi-player settings, convergence is to correlated equilibrium rather than Nash, but this has proven effective in practice.

Regret-based methods have also been applied to other imperfect-information games, including variants of bridge, Liar's Dice, and various military planning scenarios. The key insight: **minimizing regret is a robust, scalable principle** that avoids many of the difficulties of computing Nash equilibria directly.
`,
      reviewCardIds: ['rc-marl-6.9-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Regret matching assigns action probabilities proportional to positive average regrets, achieving no-regret (average regret converges to zero) regardless of opponents' behavior.
- Unconditional regret matching leads to coarse correlated equilibrium; conditional regret matching leads to the stronger correlated equilibrium.
- Actual policies in regret matching never converge -- they oscillate chaotically -- but the empirical distributions of actions converge to equilibrium.
- Counterfactual Regret Minimization (CFR) extends regret matching to large sequential games by decomposing regret across information sets.
- CFR-based methods produced Libratus and Pluribus, superhuman poker AIs, demonstrating the scalability of regret minimization to games with $10^{161}$ information sets.`,
};

export default lesson;
