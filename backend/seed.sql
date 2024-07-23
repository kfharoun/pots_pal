-- Truncate the tables using CASCADE to ensure all dependencies are handled
TRUNCATE TABLE "data" CASCADE;
TRUNCATE TABLE "days" CASCADE;

-- Restart the ID sequences with the correct names
ALTER SEQUENCE data_id_seq RESTART WITH 1;
ALTER SEQUENCE days_id_seq RESTART WITH 1;

-- Seed data for Days in July 2024
INSERT INTO "days" (user_id, date, good_day, neutral_day, nauseous, fainting, bed_bound)
VALUES 
(1, '2024-07-01', TRUE, FALSE, FALSE, FALSE, FALSE),
(1, '2024-07-02', FALSE, TRUE, FALSE, FALSE, FALSE),
(1, '2024-07-03', FALSE, FALSE, TRUE, FALSE, FALSE),
(1, '2024-07-04', FALSE, FALSE, FALSE, TRUE, FALSE),
(1, '2024-07-05', FALSE, FALSE, FALSE, FALSE, TRUE),
(1, '2024-07-06', TRUE, FALSE, FALSE, FALSE, FALSE),
(1, '2024-07-07', FALSE, TRUE, FALSE, FALSE, FALSE),
(1, '2024-07-08', FALSE, FALSE, TRUE, FALSE, FALSE),
(1, '2024-07-09', FALSE, FALSE, FALSE, TRUE, FALSE),
(1, '2024-07-10', FALSE, FALSE, FALSE, FALSE, TRUE),
(1, '2024-07-11', TRUE, FALSE, FALSE, FALSE, FALSE),
(1, '2024-07-12', FALSE, TRUE, FALSE, FALSE, FALSE),
(1, '2024-07-13', FALSE, FALSE, TRUE, FALSE, FALSE),
(1, '2024-07-14', FALSE, FALSE, FALSE, TRUE, FALSE),
(1, '2024-07-15', FALSE, FALSE, FALSE, FALSE, TRUE),
(1, '2024-07-16', TRUE, FALSE, FALSE, FALSE, FALSE),
(1, '2024-07-17', FALSE, TRUE, FALSE, FALSE, FALSE),
(1, '2024-07-18', FALSE, FALSE, TRUE, FALSE, FALSE),
(1, '2024-07-19', FALSE, FALSE, FALSE, TRUE, FALSE),
(1, '2024-07-20', FALSE, FALSE, FALSE, FALSE, TRUE),
(1, '2024-07-21', TRUE, FALSE, FALSE, FALSE, FALSE),
(1, '2024-07-22', FALSE, TRUE, FALSE, FALSE, FALSE);

-- Seed data for Data corresponding to Days in July 2024
INSERT INTO "data" (day_id, meal_item, favorite_meal, favorite_meal_item, water_intake, salt_intake, weather, low_heart_rate, high_heart_rate, activity)
VALUES 
(1, ARRAY[ARRAY['Eggs', 'Bacon', 'Toast'], ARRAY['Salad', 'Chicken', 'Rice'], ARRAY['Steak', 'Potatoes', 'Green Beans']], TRUE, ARRAY['Eggs', 'Bacon', 'Toast'], 2000, 1500, 85, 60, 100, TRUE),
(2, ARRAY[ARRAY['Oatmeal', 'Fruit', 'Coffee'], ARRAY['Sandwich', 'Chips', 'Soda'], ARRAY['Pasta', 'Garlic Bread', 'Salad']], FALSE, NULL, 1800, 1400, 70, 65, 105, FALSE),
(3, ARRAY[ARRAY['Smoothie', 'Granola', 'Yogurt'], ARRAY['Sushi', 'Miso Soup', 'Tea'], ARRAY['Steak', 'Mashed Potatoes', 'Asparagus']], TRUE, ARRAY['Steak', 'Mashed Potatoes', 'Asparagus'], 2200, 1600, 65, 55, 95, TRUE),
(4, ARRAY[ARRAY['Cereal', 'Milk', 'Banana'], ARRAY['Burger', 'Fries', 'Milkshake'], ARRAY['Pizza', 'Salad', 'Soda']], FALSE, NULL, 2000, 1500, 85, 60, 100, FALSE),
(5, ARRAY[ARRAY['Pancakes', 'Syrup', 'Bacon'], ARRAY['Tacos', 'Beans', 'Rice'], ARRAY['Fish', 'Quinoa', 'Veggies']], FALSE, NULL, 1900, 1450, 75, 62, 98, FALSE),
(6, ARRAY[ARRAY['Toast', 'Eggs', 'Orange Juice'], ARRAY['Soup', 'Salad', 'Bread'], ARRAY['BBQ', 'Cornbread', 'Coleslaw']], TRUE, ARRAY['BBQ', 'Cornbread', 'Coleslaw'], 2100, 1550, 85, 58, 102, TRUE),
(7, ARRAY[ARRAY['Yogurt', 'Berries', 'Granola'], ARRAY['Salad', 'Chicken', 'Rice'], ARRAY['Chicken', 'Potatoes', 'Green Beans']], FALSE, NULL, 2000, 1500, 70, 60, 100, FALSE),
(8, ARRAY[ARRAY['Bagel', 'Cream Cheese', 'Coffee'], ARRAY['Sandwich', 'Chips', 'Soda'], ARRAY['Pasta', 'Garlic Bread', 'Salad']], FALSE, NULL, 1800, 1400, 65, 65, 105, TRUE),
(9, ARRAY[ARRAY['Smoothie', 'Granola', 'Yogurt'], ARRAY['Burger', 'Fries', 'Soda'], ARRAY['Steak', 'Mashed Potatoes', 'Veggies']], TRUE, ARRAY['Steak', 'Mashed Potatoes', 'Veggies'], 2200, 1600, 85, 55, 95, FALSE),
(10, ARRAY[ARRAY['Waffles', 'Syrup', 'Bacon'], ARRAY['Sushi', 'Miso Soup', 'Tea'], ARRAY['Pizza', 'Salad', 'Soda']], FALSE, NULL, 2000, 1500, 70, 60, 100, TRUE),
(11, ARRAY[ARRAY['Cereal', 'Milk', 'Banana'], ARRAY['Tacos', 'Beans', 'Rice'], ARRAY['Fish', 'Quinoa', 'Veggies']], FALSE, NULL, 1900, 1450, 75, 62, 98, FALSE),
(12, ARRAY[ARRAY['Toast', 'Eggs', 'Orange Juice'], ARRAY['Soup', 'Salad', 'Bread'], ARRAY['BBQ', 'Cornbread', 'Coleslaw']], TRUE, ARRAY['BBQ', 'Cornbread', 'Coleslaw'], 2100, 1550, 85, 58, 102, TRUE),
(13, ARRAY[ARRAY['Bagel', 'Cream Cheese', 'Coffee'], ARRAY['Salad', 'Chicken', 'Rice'], ARRAY['Chicken', 'Potatoes', 'Green Beans']], FALSE, NULL, 2000, 1500, 70, 60, 100, FALSE),
(14, ARRAY[ARRAY['Oatmeal', 'Fruit', 'Coffee'], ARRAY['Sandwich', 'Chips', 'Soda'], ARRAY['Pasta', 'Garlic Bread', 'Salad']], FALSE, NULL, 1800, 1400, 165, 70, 80, TRUE), 
(15, ARRAY[ARRAY['Pancakes', 'Syrup', 'Bacon'], ARRAY['Sushi', 'Miso Soup', 'Tea'], ARRAY['Steak', 'Mashed Potatoes', 'Veggies']], TRUE, ARRAY['Steak', 'Mashed Potatoes', 'Veggies'], 2200, 1600, 85, 55, 95, FALSE),
(16, ARRAY[ARRAY['Waffles', 'Syrup', 'Bacon'], ARRAY['Burger', 'Fries', 'Soda'], ARRAY['Pizza', 'Salad', 'Soda']], FALSE, NULL, 2000, 1500, 70, 60, 100, TRUE),
(17, ARRAY[ARRAY['Yogurt', 'Berries', 'Granola'], ARRAY['Tacos', 'Beans', 'Rice'], ARRAY['Fish', 'Quinoa', 'Veggies']], FALSE, NULL, 1900, 1450, 75, 62, 98, FALSE),
(18, ARRAY[ARRAY['Smoothie', 'Granola', 'Yogurt'], ARRAY['Soup', 'Salad', 'Bread'], ARRAY['BBQ', 'Cornbread', 'Coleslaw']], TRUE, ARRAY['BBQ', 'Cornbread', 'Coleslaw'], 2100, 1550, 85, 58, 102, TRUE),
(19, ARRAY[ARRAY['Toast', 'Eggs', 'Orange Juice'], ARRAY['Salad', 'Chicken', 'Rice'], ARRAY['Chicken', 'Potatoes', 'Green Beans']], FALSE, NULL, 2000, 1500, 70, 60, 100, FALSE);