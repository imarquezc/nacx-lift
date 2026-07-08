-- Self-evaluation recorded after executing an exercise: whether the weight
-- should change the next time this exercise is performed
ALTER TABLE exercise_executions
ADD COLUMN weight_feedback TEXT CHECK (weight_feedback IN ('increase', 'keep', 'decrease'));
