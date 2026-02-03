/**
 * Lesson 4.5: Limitations of Equilibrium Solutions
 *
 * Covers: Equilibrium selection, Pareto-dominated equilibria, rationality assumptions
 * Source sections: 4.7
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-4.5',
  title: 'Limitations of Equilibrium Solutions',
  sections: [
    {
      id: 'marl-4.5.1',
      title: 'Equilibrium Selection: Which Solution Do Agents Converge To?',
      content: `Nash equilibrium (and correlated equilibrium) are the dominant solution concepts in MARL, but they come with important limitations that any practitioner should understand. The first and perhaps most vexing issue is the **equilibrium selection problem**.

Games may have multiple equilibria -- sometimes infinitely many -- and each equilibrium can entail very different expected returns for different agents. Consider the Chicken game, which has three Nash equilibria yielding returns (7, 2), (2, 7), and approximately (4.66, 4.66). If agents are learning independently, which equilibrium will they converge to? There is no guarantee they will converge to the "best" one, or even to the same one.

This challenge is compounded when agents learn concurrently from local observations. Agent 1 might be adapting toward one equilibrium while Agent 2 is adapting toward a different one, and their joint behavior may oscillate or fail to converge at all. The equilibrium selection problem has been widely studied in game theory and economics, but remains an open challenge in MARL.

One approach is to use additional criteria to differentiate between equilibria -- for instance, preferring equilibria that are Pareto-optimal (Lesson 4.6) or that maximize social welfare (also Lesson 4.6). Another approach involves coordination mechanisms like pre-play communication or shared conventions. But in many MARL settings, agents lack such coordination opportunities and must discover compatible equilibria through independent learning alone.

For games with sequential moves and folk theorems, the situation is even more extreme. Essentially any feasible and enforceable set of expected returns can be realized by some equilibrium. This means the equilibrium concept alone provides very little guidance about what behavior to expect from rational agents. Additional structure or assumptions are needed to narrow the prediction.`,
      reviewCardIds: ['rc-marl-4.5-1', 'rc-marl-4.5-2'],
      illustrations: [],
    },
    {
      id: 'marl-4.5.2',
      title: 'Sub-Optimality: Best Response Does Not Mean Best Outcome',
      content: `A fundamental conceptual limitation of equilibrium solutions is that they do not necessarily maximize expected returns. Finding an equilibrium is **not** synonymous with finding the best outcome for the agents. All we know about an equilibrium is that each agent is best-responding to the others -- but mutual best responses can lead to collectively poor outcomes.

The most famous illustration is the **Prisoner's Dilemma**:

|     | C    | D    |
|-----|------|------|
| C   | -1,-1 | -5,0 |
| D   | 0,-5  | -3,-3 |

The only Nash equilibrium is (D, D), giving each agent -3. Yet (C, C) gives each agent -1, which is better for both. The problem is that (C, C) is not a Nash equilibrium -- each agent can unilaterally deviate to D and improve from -1 to 0. So rational, self-interested agents are "trapped" in a worse outcome.

Similarly, in the Chicken game, the correlated equilibrium with returns of 5 per agent is outperformed by the joint action (L, L) which gives 6 per agent -- but (L, L) is neither a Nash equilibrium nor a correlated equilibrium because each agent can deviate to S and get 7 (at the risk of the catastrophic (S, S) outcome of 0).

This sub-optimality means that achieving an equilibrium solution should not be the *only* goal in MARL. In cooperative settings or common-reward games, we often care about maximizing total return rather than merely reaching stability. Equilibrium concepts tell us about stability -- no one wants to deviate -- but stability and optimality are different properties. Recognizing this distinction is crucial for choosing the right solution concept for a given application.`,
      reviewCardIds: ['rc-marl-4.5-3', 'rc-marl-4.5-4'],
      illustrations: [],
    },
    {
      id: 'marl-4.5.3',
      title: 'Incompleteness and Off-Equilibrium Behavior',
      content: `For games with sequential moves (stochastic games, POSGs), equilibrium solutions suffer from a third limitation: **incompleteness**. An equilibrium joint policy $\\pi$ specifies behavior along the "equilibrium path" -- the trajectories that occur with positive probability under $\\pi$. But it says nothing about what agents should do if something unexpected happens and the game reaches a state that has zero probability under the equilibrium. These are called **off-equilibrium paths**.

Why would the game ever leave the equilibrium path? In practice, agents may experience temporary disturbances: exploration noise, communication errors, or simply bugs in implementation. If such a disturbance pushes the game onto an off-equilibrium path, the equilibrium policy provides no guidance for how to recover. The agents are effectively "off the map."

Game theorists have developed refinement concepts to address this issue. **Subgame perfect equilibrium** requires that the agents' policies form a Nash equilibrium in every subgame (every possible continuation of the game), not just on the equilibrium path. **Trembling-hand perfect equilibrium** (Selten, 1988) considers the possibility that agents may "tremble" and play unintended actions with small probability, requiring robustness to such trembles. These refinements strengthen the equilibrium concept by ensuring that behavior is well-defined everywhere, not just on the expected path.

In MARL, off-equilibrium robustness is particularly relevant because learning agents explore and make mistakes. An algorithm that converges to a Nash equilibrium of the "on-path" game may perform poorly if it has never learned good behavior for off-path situations. This connects to the broader exploration-exploitation challenge in reinforcement learning, amplified by the multi-agent setting.

Together, these limitations -- equilibrium selection, sub-optimality, and incompleteness -- motivate the additional solution concepts and refinements we cover in the remaining lessons of this module.`,
      reviewCardIds: ['rc-marl-4.5-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- The **equilibrium selection problem**: games can have multiple equilibria with different returns, and independently learning agents have no guarantee of converging to the same one.
- Equilibria are **not necessarily optimal**: mutual best responses can produce collectively poor outcomes, as in the Prisoner's Dilemma where (D, D) is the only NE despite (C, C) being better for both.
- For sequential-move games, equilibria are **incomplete** -- they do not specify behavior on off-equilibrium paths reached by unexpected events or exploration.
- Refinements like **subgame perfect equilibrium** and **trembling-hand perfect equilibrium** address incompleteness by requiring well-defined behavior everywhere.
- These limitations motivate additional solution concepts like Pareto optimality, social welfare, and no-regret learning.`,
};

export default lesson;
