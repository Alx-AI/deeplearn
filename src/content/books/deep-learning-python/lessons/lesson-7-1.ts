/**
 * Lesson 7.1: Hyperparameter Optimization and Model Ensembling
 *
 * Covers: Grid search, random search, Bayesian optimization, ensembling
 * Source sections: 18.1.1, 18.1.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '7.1',
  title: 'Hyperparameter Optimization and Model Ensembling',
  sections: [
    {
      id: '7.1.1',
      title: 'Strategies for Hyperparameter Search',
      content: `
**Hyperparameters** are the settings you choose before training begins: learning rate, number of layers, units per layer, dropout rate, batch size. Unlike model weights, they are not learned by gradient descent -- you must search for good values yourself.

**Grid search** tries every combination of a predefined set of values. With 5 hyperparameters at 5 values each, that is 5^5 = 3,125 evaluations. It is thorough but expensive, and most of the budget is wasted on unimportant parameters.

**Random search** samples random combinations from the hyperparameter space. This is typically more efficient because not all hyperparameters are equally important. If only 2 of 5 parameters matter, random search explores many unique values of those 2, while grid search wastes evaluations on irrelevant combinations. Research by Bergstra and Bengio showed that random search finds good configurations with far fewer evaluations.

**Bayesian optimization** (e.g., Keras Tuner, Optuna) is the smartest approach. It builds a probabilistic model of the hyperparameter-to-performance mapping and uses it to decide what to try next. It balances **exploration** (trying new regions) with **exploitation** (focusing on promising regions):

\`\`\`python
import keras_tuner

def build_model(hp):
    model = keras.Sequential()
    units = hp.Int("units", min_value=32, max_value=512, step=32)
    model.add(layers.Dense(units, activation="relu"))
    model.add(layers.Dense(10, activation="softmax"))
    lr = hp.Float("lr", min_value=1e-4, max_value=1e-2, sampling="log")
    model.compile(optimizer=keras.optimizers.Adam(lr), loss="sparse_categorical_crossentropy")
    return model

tuner = keras_tuner.BayesianOptimization(build_model, objective="val_loss", max_trials=50)
tuner.search(x_train, y_train, validation_data=(x_val, y_val), epochs=20)
\`\`\`
`,
      reviewCardIds: ['rc-7.1-1', 'rc-7.1-2', 'rc-7.1-3'],
      illustrations: ['hyperparam-search'],
      codeExamples: [
        {
          title: 'Random search with Keras Tuner',
          language: 'python',
          code: `import keras_tuner

def build_model(hp):
    model = keras.Sequential()
    for i in range(hp.Int("num_layers", 1, 3)):
        model.add(keras.layers.Dense(
            hp.Int(f"units_{i}", 32, 256, step=32),
            activation="relu"))
        model.add(keras.layers.Dropout(
            hp.Float(f"dropout_{i}", 0.0, 0.5, step=0.1)))
    model.add(keras.layers.Dense(10, activation="softmax"))
    model.compile(
        optimizer=keras.optimizers.Adam(
            hp.Float("lr", 1e-4, 1e-2, sampling="log")),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"])
    return model

tuner = keras_tuner.RandomSearch(
    build_model, objective="val_accuracy",
    max_trials=30, directory="tuner_results")
tuner.search(x_train, y_train,
             validation_data=(x_val, y_val), epochs=10)
best_model = tuner.get_best_models(num_models=1)[0]`,
        },
        {
          title: 'Retrieving and using the best hyperparameters',
          language: 'python',
          code: `best_hp = tuner.get_best_hyperparameters(num_trials=1)[0]
print(f"Best learning rate: {best_hp.get('lr')}")
print(f"Best num layers: {best_hp.get('num_layers')}")
print(f"Best units layer 0: {best_hp.get('units_0')}")

# Retrain best model on full training data
model = tuner.hypermodel.build(best_hp)
model.fit(x_train, y_train, epochs=50,
          validation_data=(x_val, y_val))`,
        },
      ],
    },
    {
      id: '7.1.2',
      title: 'Model Ensembling',
      content: `
**Model ensembling** combines predictions from multiple different models for better overall accuracy. Five models at 92-94% accuracy can ensemble to 96% because different models make different errors that cancel out when averaged.

For regression, average the predictions. For classification, average the predicted probabilities (soft voting) or take the majority vote (hard voting).

The key to effective ensembling is **diversity**. Models must make different errors for ensembling to help. Sources of diversity:
- **Different architectures**: ResNet + Xception + EfficientNet
- **Different hyperparameters**: varying learning rates, dropout, layer sizes
- **Different data subsets**: training each model on a random 80% of the data (bagging)
- **Different random seeds**: same architecture initialized differently

If all models are nearly identical, they make the same errors and ensembling provides no benefit. Maximum diversity equals maximum ensemble gain.

Ensembling is the final tool for squeezing out extra performance. It is standard practice in ML competitions (virtually every Kaggle winner uses ensembles) and production systems where accuracy matters more than inference cost. The tradeoff is that you must run multiple models at inference time, multiplying computational cost.
`,
      reviewCardIds: ['rc-7.1-4', 'rc-7.1-5'],
      illustrations: ['model-ensembling'],
      codeExamples: [
        {
          title: 'Ensemble predictions by averaging probabilities (soft voting)',
          language: 'python',
          code: `import numpy as np

# Assume models is a list of trained Keras models
models = [model_a, model_b, model_c]

# Get probability predictions from each model
preds = np.array([m.predict(x_test) for m in models])

# Average probabilities across models (soft voting)
ensemble_preds = np.mean(preds, axis=0)
final_classes = np.argmax(ensemble_preds, axis=1)`,
        },
        {
          title: 'Weighted ensemble with validation-based weights',
          language: 'python',
          code: `import numpy as np

# Weight models by their validation accuracy
val_accs = [0.92, 0.94, 0.91]
weights = np.array(val_accs) / sum(val_accs)

preds = np.array([m.predict(x_test) for m in models])
weighted_preds = np.average(preds, axis=0, weights=weights)
final_classes = np.argmax(weighted_preds, axis=1)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Hyperparameters (learning rate, layers, units, dropout) must be searched -- they are not learned by gradient descent.
- Random search is usually more efficient than grid search; Bayesian optimization is the smartest approach.
- Model ensembling combines diverse models to achieve accuracy beyond any single model.
- Ensemble diversity is key: different architectures, hyperparameters, data subsets, or random seeds.
- Ensembling is standard in competitions and production when accuracy justifies extra inference cost.`,
};

export default lesson;
