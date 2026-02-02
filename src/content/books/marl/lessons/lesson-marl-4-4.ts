/**
 * Lesson 4.4: Correlated Equilibrium
 *
 * Covers: CE definition and correlation device, CE vs NE, coarse correlated equilibrium
 * Source sections: 4.6
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-4.4',
  title: 'Correlated Equilibrium',
  sections: [
    {
      id: 'marl-4.4.1',
      title: 'Correlated Equilibrium and the Correlation Device',
      content: `Nash equilibrium requires agents' policies to be probabilistically independent -- each agent randomizes on its own without coordination. This independence can limit the expected returns achievable by the agents. **Correlated equilibrium** (Aumann, 1974) generalizes Nash equilibrium by allowing correlation between agents' actions through a shared randomization device.

The idea is intuitive: imagine a trusted mediator (or "correlation device") that samples a joint action a from a distribution pi_c(a) and privately recommends each agent i its component action a_i. Each agent knows the full distribution pi_c but only sees its own recommendation, not the recommendations sent to others. The key question is: does any agent have an incentive to deviate from its recommendation?

Formally, a joint policy pi_c(a) over joint actions a is a **correlated equilibrium** if for every agent i and every **action modifier** xi_i: A_i -> A_i:

sum over a of pi_c(a) * R_i(xi_i(a_i), a_{-i}) <= sum over a of pi_c(a) * R_i(a)

The action modifier represents any way agent i might deviate from its recommendations. This says that no matter how agent i transforms its recommended actions, it cannot increase its expected return -- assuming it does not know the specific actions recommended to other agents.

The set of correlated equilibria **contains** all Nash equilibria as a special case. A Nash equilibrium is simply a correlated equilibrium where pi_c factors into independent policies: pi_c(a) = product of pi_i(a_i). In a Nash equilibrium, knowing your own action gives no information about others' actions because the policies are independent. Correlated equilibrium allows for richer dependencies.

Similarly to epsilon-NE, we can define **epsilon-correlated equilibrium** by adding a tolerance of epsilon on the left side of the inequality, meaning no agent can gain more than epsilon by deviating from its recommendations.`,
      reviewCardIds: ['rc-marl-4.4-1', 'rc-marl-4.4-2'],
      illustrations: [],
    },
    {
      id: 'marl-4.4.2',
      title: 'CE vs NE: The Chicken Game Example',
      content: `To see how correlated equilibrium can achieve *better* returns than any Nash equilibrium, consider the **Chicken game**:

|     | S    | L    |
|-----|------|------|
| S   | 0,0  | 7,2  |
| L   | 2,7  | 6,6  |

Two vehicles on a collision course can Stay (S) or Leave (L). The three Nash equilibria with their expected returns (U_i, U_j) are:
- pi_i(S)=1, pi_j(S)=0: returns (7, 2)
- pi_i(S)=0, pi_j(S)=1: returns (2, 7)
- pi_i(S)=1/3, pi_j(S)=1/3: returns approximately (4.66, 4.66)

Now consider the correlated joint policy:
- pi_c(L, L) = pi_c(S, L) = pi_c(L, S) = 1/3
- pi_c(S, S) = 0

The expected return to each agent is: (7 * 1/3) + (2 * 1/3) + (6 * 1/3) = 5. This is better than the mixed Nash equilibrium's 4.66 for each agent.

To verify this is a correlated equilibrium, suppose agent i receives recommendation L. Given pi_c, agent i infers that agent j will play S with probability 0.5 and L with probability 0.5 (since of the two joint actions containing a_i = L, one has a_j = S and one has a_j = L). Agent i's expected return from following L is: 2 * 0.5 + 6 * 0.5 = 4. If i deviates to S instead, the expected return is: 0 * 0.5 + 7 * 0.5 = 3.5. Since 4 > 3.5, agent i has no incentive to deviate. A similar argument holds when the recommendation is S. So the correlation device achieves something impossible under independent randomization.

Correlated equilibrium can again be described as mutual best responses, but now each recommended action a_i is a best response to the *conditional* distribution over others' actions given a_i -- not the marginal distribution as in Nash equilibrium.`,
      reviewCardIds: ['rc-marl-4.4-3', 'rc-marl-4.4-4'],
      illustrations: [],
    },
    {
      id: 'marl-4.4.3',
      title: 'Coarse Correlated Equilibrium and LP Computation',
      content: `An even more general solution concept is the **coarse correlated equilibrium** (CCE), introduced by Moulin and Vial (1978). The difference is subtle but important. In a correlated equilibrium, each agent decides whether to deviate *after* seeing its recommended action. In a coarse correlated equilibrium, each agent decides *before* seeing its recommendation -- it must choose upfront whether to follow the device or play a fixed action instead.

Formally, a CCE only requires the no-deviation inequality to hold for **unconditional action modifiers** -- constant functions that always output the same action regardless of the recommendation. If no agent can select a constant action that beats following the device, it is a CCE. Every correlated equilibrium is also a CCE (since correlated equilibrium must handle all modifiers, not just constant ones), but the reverse is not necessarily true. The hierarchy of inclusion is: Nash equilibria are a subset of correlated equilibria, which are a subset of coarse correlated equilibria.

Both CE and CCE for non-repeated normal-form games can be computed via **linear programming**. For CE, the LP has variables x_a for each joint action a representing pi_c(a), and maximizes social welfare (or another objective) subject to:

- No agent gains from deviating: for all agents i and action pairs (a'_i, a''_i), the expected return from following a'_i is at least as good as switching to a''_i
- x_a >= 0 for all a, and sum of x_a = 1

For CCE, the constraints simplify -- we only need that no agent gains from switching to any constant action. The LP for CE has n * k^2 deviation constraints (n agents, k actions each), while CCE has only n * k constraints. However, both LPs have k^n variables (one per joint action), which grows exponentially in the number of agents.

The polynomial-time solvability of CE and CCE via linear programming stands in sharp contrast to Nash equilibrium, which (as we will see) is computationally much harder. This is one reason correlated equilibrium has gained attention as a more tractable solution concept for MARL.`,
      reviewCardIds: ['rc-marl-4.4-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- **Correlated equilibrium** (CE) generalizes Nash equilibrium by allowing a shared correlation device that privately recommends actions to agents. No agent gains by deviating from its recommendation.
- CE can achieve higher expected returns than any Nash equilibrium, as demonstrated in the Chicken game (returns of 5 vs. 4.66 per agent).
- **Coarse correlated equilibrium** (CCE) is even more general: agents decide whether to follow the device *before* seeing their recommendation, rather than after.
- The inclusion hierarchy is: NE is a subset of CE, which is a subset of CCE.
- Both CE and CCE can be computed in polynomial time via **linear programming** for normal-form games, making them more tractable than Nash equilibrium.`,
};

export default lesson;
