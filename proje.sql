-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 16, 2019 at 10:07 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `proje`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `spYeniSeyahatEkle` (IN `username` VARCHAR(50), IN `sehir` VARCHAR(20), IN `yil` VARCHAR(20))  BEGIN
	DECLARE sehirId int;
    DECLARE sehirBulunmaSayisi int;
    DECLARE kullaniciId int;
    
	SELECT 
		count(city_id) into sehirBulunmaSayisi
	FROM 
		cities
	WHERE 
		city_name = sehir;
        
    IF sehirBulunmaSayisi = 0 THEN
    	insert into cities (city_name) values (sehir);
        set sehirId = LAST_INSERT_ID();
    ELSE
    	select city_id into sehirId from cities 
        where city_name = sehir;
    END IF;
    
    SELECT user_id INTO kullaniciId 
    FROM users WHERE users.username = username;
    
    INSERT INTO city_visits (user_id, city_id, date_visited)
    VALUES (kullaniciId, sehirId, STR_TO_DATE(CONCAT('1/1/',yil), '%d/%m/%Y'));    
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `city_id` int(11) NOT NULL,
  `city_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`city_id`, `city_name`) VALUES
(2, 'Bursa'),
(4, 'İstanbul'),
(7, 'İzmir'),
(5, 'Kayseri'),
(1, 'Nevşehir'),
(3, 'Sakarya'),
(6, 'Tekirdağ');

-- --------------------------------------------------------

--
-- Table structure for table `city_visits`
--

CREATE TABLE `city_visits` (
  `city_visit_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `date_visited` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `city_visits`
--

INSERT INTO `city_visits` (`city_visit_id`, `user_id`, `city_id`, `date_visited`) VALUES
(1, 1, 1, '1997-01-01'),
(2, 1, 2, '2000-01-01'),
(3, 1, 3, '2003-01-01'),
(4, 1, 4, '2006-01-01'),
(5, 1, 5, '2007-01-01'),
(6, 2, 6, '2013-01-01'),
(7, 2, 7, '2016-01-01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `email`, `phone_number`) VALUES
(1, 'beyza', '$2a$10$C6ZsnfLq0q2cjc/RxyzWNuwlvPz7KkiDQhzkitm.bAZ2Zz3rL.2EO', 'beyza@proje.com', '5555555555'),
(2, 'kerem', '$2a$10$jg1lADiS62wtzAlpSeFiYupHZz9fodJ6TzeSUZnfEhq6QeJSlgsUm', 'kerem@proje.com', '5555555555');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`city_id`),
  ADD UNIQUE KEY `city_name` (`city_name`);

--
-- Indexes for table `city_visits`
--
ALTER TABLE `city_visits`
  ADD PRIMARY KEY (`city_visit_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `city_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `city_visits`
--
ALTER TABLE `city_visits`
  MODIFY `city_visit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `city_visits`
--
ALTER TABLE `city_visits`
  ADD CONSTRAINT `city_visits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `city_visits_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
