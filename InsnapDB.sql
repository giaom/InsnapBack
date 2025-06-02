CREATE DATABASE InsnapDB;
USE InsnapDB;

CREATE TABLE Users (
    Username VARCHAR(30) PRIMARY KEY,
    ProfilePic VARCHAR(255),
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(30) NOT NULL
);

CREATE TABLE Uploads (
    Upload_Id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    Address VARCHAR(300),
    Poster VARCHAR(30) NOT NULL,
    Created_at DATETIME NOT NULL,
    Access ENUM('PUBLIC', 'FRIENDS', 'PRIVATE') NOT NULL,
    Caption VARCHAR(300),
    Likes INT,
    FOREIGN KEY (Poster) REFERENCES Users(Username)
);

CREATE TABLE Tags (
    TAG VARCHAR(50) NOT NULL,
    Post_Id CHAR(36) NOT NULL,
    FOREIGN KEY (Post_Id) REFERENCES Uploads(Upload_Id)
);

CREATE TABLE Friends (
    Username VARCHAR(30) NOT NULL,
    Friendname VARCHAR(30) NOT NULL,
    Status ENUM('FRIENDS', 'PENDING', 'REJECTED') NOT NULL,
    PRIMARY KEY (Username, Friendname),
    FOREIGN KEY (Username) REFERENCES Users(Username),
    FOREIGN KEY (Friendname) REFERENCES Users(Username)
);


CREATE TABLE Comments (
    Comment_Id INT AUTO_INCREMENT PRIMARY KEY,
    Upload_Id CHAR(36) NOT NULL,
    Username VARCHAR(30) NOT NULL,
    Text VARCHAR(300),
    FOREIGN KEY (Upload_Id) REFERENCES Uploads(Upload_Id),
    FOREIGN KEY (Username) REFERENCES Users(Username)
);

CREATE TABLE Likes (
    Upload_Id CHAR(36) NOT NULL,
    Username VARCHAR(30) NOT NULL,
    PRIMARY KEY (Upload_Id, Username),
    FOREIGN KEY (Upload_Id) REFERENCES Uploads(Upload_Id),
    FOREIGN KEY (Username) REFERENCES Users(Username)
);


