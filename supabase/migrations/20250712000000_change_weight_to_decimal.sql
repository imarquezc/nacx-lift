-- Change weight_kg column from INTEGER to DECIMAL to support fractional weights (e.g., 2.5 kg)
ALTER TABLE exercise_executions 
ALTER COLUMN weight_kg TYPE DECIMAL(5,2);