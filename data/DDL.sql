-- CS 340 Project Step 2 Draft DDL
-- Team 91 - Alessandro Ceserani and Joseph Keehnast
-- 02/08/2024

-- Citation start
-- Date: 02/08/2024
-- https://canvas.oregonstate.edu/courses/1946034/assignments/9456214
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
-- Citation end

CREATE OR REPLACE TABLE Runners (
    runnerID INT NOT NULL UNIQUE AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    skillLevel VARCHAR(50),
    goal INT,
    fiveKPace INT,
    tenKPace INT,
    marathonPace INT,
    recoveryPace INT,
    PRIMARY KEY (runnerID)
);

CREATE OR REPLACE TABLE TrainingPlans (
    trainingPlanID INT NOT NULL UNIQUE AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    skillLevel VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    PRIMARY KEY (trainingPlanID)
);

CREATE OR REPLACE TABLE Invoices (
    invoiceID INT NOT NULL UNIQUE AUTO_INCREMENT,
    runnerID INT NOT NULL,
    trainingPlanID INT NOT NULL,
    orderDate DATE NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    PRIMARY KEY (invoiceID),
    FOREIGN KEY (runnerID)
        REFERENCES Runners(runnerID)
        ON DELETE CASCADE,
    FOREIGN KEY (trainingPlanID)
        REFERENCES TrainingPlans(trainingPlanID)
        ON DELETE CASCADE
);

CREATE OR REPLACE TABLE RunTypes (
    runTypeID INT NOT NULL UNIQUE AUTO_INCREMENT,
    runType VARCHAR(50) NOT NULL,
    pace VARCHAR(50),
    description VARCHAR(255),
    PRIMARY KEY (runTypeID)
);

CREATE OR REPLACE TABLE DailyRuns (
    dailyRunID INT NOT NULL UNIQUE AUTO_INCREMENT,
    day INT NOT NULL,
    week INT NOT NULL,
    distance INT NOT NULL,
    runTypeID INT NOT NULL,
    trainingPlanID INT NOT NULL,
    PRIMARY KEY (dailyRunID),
    FOREIGN KEY (trainingPlanID)
        REFERENCES TrainingPlans(trainingPlanID)
        ON DELETE CASCADE,
    FOREIGN KEY (runTypeID)
        REFERENCES RunTypes(runTypeID)
        ON DELETE CASCADE
);

-- Intersection tables

CREATE OR REPLACE TABLE RunnerTrainingPlans (
    runnerID INT NOT NULL,
    trainingPlanID INT NOT NULL,
    PRIMARY KEY (runnerID, trainingPlanID),
    FOREIGN KEY (runnerID)
        REFERENCES Runners(runnerID)
        ON DELETE CASCADE,
    FOREIGN KEY (trainingPlanID)
        REFERENCES TrainingPlans(trainingPlanID)
        ON DELETE CASCADE
);


-- Insert data

INSERT INTO Runners (
    runnerID, firstName, lastName, email, skillLevel, goal, fiveKPace, tenKPace, marathonPace, recoveryPace
)
VALUES
    (1, "Eric", "Johnson", "ejohns@gmail.com", "Intermediate", 10800, 405, 422, 465, 540),
    (2, "Bridget", "Banner", "bbanner@yahoo.com", "Beginner", 18000, 585, 615, 680, 780),
    (3, "Mark", "Malesewski", "mmal@gmail.com", "Advanced", 9900, 305, 330, 378, 450),
    (4, "Samantha", "Simms", "ssims@outlook.com", NULL, NULL, NULL, NULL, NULL, NULL);


INSERT INTO Invoices (
    invoiceID, runnerID, trainingPlanID, orderDate, price
)
VALUES
    (1, 1, 1, "2022-02-23", 34),
    (2, 2, 2, "2023-07-06", 19),
    (3, 3, 3, "2023-09-20", 39),
    (4, 4, 4, "2022-05-06", 29);


INSERT INTO TrainingPlans (
    trainingPlanID, name, skillLevel, duration, price
)
VALUES
    (1, "Intermediate Intense", "Intermediate", 18, 34),
    (2, "Beginner Basic", "Beginner", 12, 19),
    (3, "Advanced Intense", "Advanced", 24, 39),
    (4, "Intermediate Low Mileage", "Intermediate", 18, 29);


INSERT INTO DailyRuns (
    dailyRunID, day, week, distance, trainingPlanID, runTypeID
)
VALUES
    (1, 1, 1, 5, 1, 1),
    (2, 2, 1, 6, 1, 2),
    (3, 3, 1, 5, 1, 3),
    (4, 4, 1, 6, 1, 2),
    (5, 5, 1, 8, 1, 8),
    (6, 6, 1, 4, 1, 7),
    (7, 1, 1, 4, 2, 1),
    (8, 2, 1, 5, 2, 2),
    (9, 3, 1, 7, 2, 3),
    (10, 4, 1, 5, 2, 2),
    (11, 5, 1, 6, 2, 8),
    (12, 6, 1, 9, 2, 7),
    (13, 1, 1, 8, 3, 1),
    (14, 2, 1, 7, 3, 2),
    (15, 3, 1, 10, 3, 3),
    (16, 4, 1, 4, 3, 2),
    (17, 5, 1, 2, 3, 8),
    (18, 6, 1, 10, 3, 7),
    (19, 1, 1, 12, 4, 1),
    (20, 2, 1, 9, 4, 2),
    (21, 3, 1, 9, 4, 3),
    (22, 4, 1, 10, 4, 2),
    (23, 5, 1, 7, 4, 8),
    (24, 6, 1, 10, 4, 7);

INSERT INTO RunTypes (
    runTypeID, runType, pace, description
)
VALUES
    (1, "Threshold Run", "tenKPace", "1 mile warmup, 1 mile cooldown, 3 miles at 5k-10k pace"),
    (2, "Recovery Run", "recoveryPace", "run 1-2 min slower than marathon goal pace"),
    (3, "Marathon Pace", "marathonPace", "1 mile warmup, 6 miles at marathon pace, 1 mile recovery pace"), 
    (4, "5K time trial", "fiveKPace", "run 3 miles at 5k pace or faster"),
    (5, "10k time trial", "tenKPace", "run 6 miles at 10k pace or faster"),
    (6, "Mile Repeat", "tenKPace", "1 mile warmup, 1 mile 10k pace, 2min recovery, 1 mile 10k pace, 2min recovery, 1 mile 10k pace, 1 mile recovery pace"),
    (7, "Long Run", "recoveryPace", "Run 12 miles at recovery pace"),
    (8, "Rest Day", NULL, "Don't Run");


-- INSERT into intersection tables:

INSERT INTO RunnerTrainingPlans (
    runnerID, trainingPlanID
)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4);


-- Citation start
-- Date: 02/08/2024
-- https://canvas.oregonstate.edu/courses/1946034/assignments/9456214
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

