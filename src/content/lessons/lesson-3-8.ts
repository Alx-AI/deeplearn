/**
 * Lesson 3.8: Defining the Task
 *
 * Covers: Framing problems, collecting data, success metrics
 * Source sections: 6.1.1, 6.1.2, 6.1.3, 6.1.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.8',
  title: 'Defining the Task',
  sections: [
    {
      id: '3.8.1',
      title: 'Framing the Problem',
      content: `
Everything you have learned about generalization, evaluation, and regularization is critical knowledge -- but in the real world, you do not start from a prepared dataset. You start from a **problem**. The universal workflow of machine learning begins with defining the task clearly, long before any code is written.

Framing a problem means answering several fundamental questions:

- **What will the input data be?** What information is available, and in what form?
- **What are you trying to predict?** What are the targets?
- **What type of ML task is this?** Binary classification? Multiclass classification? Regression? Ranking? Something else entirely?
- **What do existing solutions look like?** Is there a hand-crafted algorithm or a human process currently handling this task?
- **Are there constraints?** Latency requirements, privacy concerns, deployment environment limitations?

Different problems map to different task types. A spam detector is binary classification. A photo tagging system is multiclass, multilabel classification. Predicting ad click-through rates is scalar regression. Identifying anomalous cookies on a factory conveyor belt might require object detection followed by binary classification.

Two hypotheses underpin every ML project:

1. **Your outputs can be predicted from your inputs.** This is not always true. Stock prices, for instance, may not be predictable from recent price history alone.

2. **The available data is sufficient to learn the relationship.** Even if a relationship exists in principle, you need enough representative data to discover it.

Until you have a working model, these are assumptions, not facts. Be prepared to revisit them if initial results are disappointing.
`,
      reviewCardIds: ['rc-3.8-1', 'rc-3.8-2'],
      illustrations: ['ml-workflow'],
      codeExamples: [
        {
          title: 'Choosing the right last-layer activation and loss for your task type',
          language: 'python',
          code: `from keras import Sequential, layers

# Binary classification
binary_model = Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(1, activation="sigmoid"),  # output in [0, 1]
])
binary_model.compile(loss="binary_crossentropy", optimizer="adam")

# Multiclass classification (10 classes)
multi_model = Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(10, activation="softmax"),  # probabilities sum to 1
])
multi_model.compile(loss="categorical_crossentropy", optimizer="adam")

# Regression (no activation on output)
reg_model = Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(1),  # unconstrained scalar output
])
reg_model.compile(loss="mse", optimizer="adam")`,
        },
      ],
    },
    {
      id: '3.8.2',
      title: 'Collecting and Understanding Your Data',
      content: `
Data collection is typically the most time-consuming and expensive part of a machine learning project. A model's ability to generalize depends almost entirely on the properties of its training data -- the number of samples, the reliability of labels, and the quality of features.

If you have supervised learning task, you need both inputs and **annotations** (labels). These might come for free -- user clicks, purchase history, existing tags -- or they might require manual labeling, which demands careful infrastructure decisions:

- **Who does the labeling?** Can anyone do it, or is domain expertise required? Labeling medical images requires a physician; labeling cats vs. dogs does not.
- **What tool do you use?** Good annotation software saves enormous amounts of time. It is worth investing early.
- **How do you ensure quality?** Noisy labels degrade model performance. Multiple annotators and quality audits help.

Before building any model, **explore your data**. This is not optional:

- Visualize samples and their labels directly
- Plot histograms of numerical feature values
- Check for class imbalance -- if one class is 100x more common, you need to account for it
- Look for missing values, duplicates, and outliers
- Check for **target leakage** -- features that contain information about the target that would not be available in production

A critical concern is **representativeness**. Training data must resemble production data. If you train a food recognition model on professional photography from a foodie social network, it will fail on blurry smartphone photos from restaurant patrons. Always ask: will the data my model sees in production look like the data I am training on?

**Concept drift** is a related issue: the properties of production data change over time. A music recommendation model from 2013 is outdated today. A credit card fraud detector may become stale in days. Plan for periodic retraining from the start.
`,
      reviewCardIds: ['rc-3.8-3', 'rc-3.8-4'],
      illustrations: ['dataset-curation'],
      codeExamples: [
        {
          title: 'Exploring a dataset: class balance and basic statistics',
          language: 'python',
          code: `import numpy as np

# Check class distribution
labels = np.array([0, 0, 0, 1, 0, 0, 1, 0, 0, 0])
unique, counts = np.unique(labels, return_counts=True)
for cls, cnt in zip(unique, counts):
    print(f"Class {cls}: {cnt} samples ({cnt/len(labels)*100:.0f}%)")
# Class 0: 8 samples (80%)  -- imbalanced!
# Class 1: 2 samples (20%)`,
        },
        {
          title: 'Detecting potential target leakage in features',
          language: 'python',
          code: `import numpy as np

# Suspiciously perfect correlation = likely leakage
features = np.random.randn(1000, 5)
target = features[:, 3] > 0  # feature 3 perfectly predicts target

correlations = [np.corrcoef(features[:, i], target)[0, 1]
                for i in range(5)]
for i, corr in enumerate(correlations):
    flag = " <-- LEAKAGE?" if abs(corr) > 0.95 else ""
    print(f"Feature {i}: correlation = {corr:.3f}{flag}")`,
        },
      ],
    },
    {
      id: '3.8.3',
      title: 'Choosing a Measure of Success',
      content: `
To control something, you must observe it. Your **success metric** will guide every technical decision throughout the project, so choose it carefully. It should align directly with your higher-level business goals.

Common metrics for different problem types:

- **Balanced classification** -- Accuracy or ROC AUC work well when classes are roughly equally represented.
- **Imbalanced classification** -- Accuracy is misleading. If 99% of transactions are legitimate, a model that always says "not fraud" gets 99% accuracy while catching zero fraud. Use **precision** (of predicted positives, how many are real?), **recall** (of actual positives, how many were caught?), or **F1 score** (harmonic mean of precision and recall).
- **Ranking problems** -- Mean average precision or normalized discounted cumulative gain (nDCG).
- **Regression** -- Mean absolute error or mean squared error, depending on how much you want to penalize large errors.

Sometimes the right metric is not a standard ML metric at all. For a music recommendation engine, "user retention rate" might matter more than click-through rate. For an ad system, revenue per impression could be the true goal. The key is to connect the ML metric to the business outcome.

It is also worth noting the ethical dimension. Not every ML project should be pursued. A model that "rates trustworthiness from a face photo" would merely encode the biases of its labelers into an algorithm with a veneer of objectivity. Technology is not neutral -- every technical choice is also an ethical choice. Always consider what values your work supports and what impact it may have on real people.
`,
      reviewCardIds: ['rc-3.8-5'],
      illustrations: ['hyperparam-search'],
      codeExamples: [
        {
          title: 'Computing precision, recall, and F1 for imbalanced data',
          language: 'python',
          code: `from sklearn.metrics import precision_score, recall_score, f1_score

y_true = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
y_pred = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]

print(f"Precision: {precision_score(y_true, y_pred):.2f}")  # 1.00
print(f"Recall:    {recall_score(y_true, y_pred):.2f}")     # 0.50
print(f"F1 Score:  {f1_score(y_true, y_pred):.2f}")         # 0.67
# Accuracy would be 90% -- misleading for imbalanced data`,
        },
        {
          title: 'ROC AUC for balanced classification',
          language: 'python',
          code: `from sklearn.metrics import roc_auc_score
import numpy as np

y_true = np.array([0, 0, 1, 1, 1, 0, 1, 0])
y_scores = np.array([0.1, 0.3, 0.8, 0.7, 0.9, 0.2, 0.6, 0.4])

auc = roc_auc_score(y_true, y_scores)
print(f"ROC AUC: {auc:.3f}")
# 1.0 = perfect ranking, 0.5 = random guessing`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- The ML workflow starts with defining the task: what are the inputs, outputs, problem type, and constraints?
- Two core hypotheses must hold: outputs are predictable from inputs, and sufficient data is available.
- Data collection is typically the most expensive part of an ML project. Invest in quality labels and annotation infrastructure.
- Always explore your data before modeling: check distributions, class balance, missing values, and target leakage.
- Training data must be representative of production data. Watch for concept drift over time.
- Choose a success metric that aligns with the business goal. Standard accuracy can be misleading for imbalanced problems.
- Consider the ethical implications of your work -- ML is not neutral.`,
};

export default lesson;
