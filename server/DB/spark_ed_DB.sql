-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 27, 2025 at 08:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spark_ed`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `stud_id` int(11) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'pending',
  `requested_amount` int(11) DEFAULT NULL,
  `approved_amount` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `name`, `description`, `stud_id`, `status`, `requested_amount`, `approved_amount`, `company_id`) VALUES
(1, 'New project', 'hjfrhj grb gjbg ergbegjr grjg rjgr ghjer grehg rehgjr ghjr', 1, 'funded', 250000, 5500, 2),
(2, 'new project 2', 'riherg erhge rgbejg rhj befhjb rej erh dfvhf vrehjv vh rehjb chdv hvjre hrejb vdc svhre rehjb', 1, 'funded', 25899, 5000, 2),
(3, 'ejwkf ew ', 'kwe gr grwkg ewhgjb3wekg k rgke ek hkrg bgj wghkrw ghkds vk bdfk ddk rebhkre ', 1, NULL, 859666, NULL, NULL),
(4, 'kjefbgurgbq', 'kbgreuogkber hlek greihg ehrgerhgerg fvcb djg er rk hre grek rerek', 1, NULL, 8596666, NULL, NULL),
(5, 'hrgw hgrw ', 'ljr gkehkrg rwhjg regbjwr gjrbgr ghrjg rhgr fkhsreghirj grhg twe hbre brhg rglr ghljgr gr j', 1, NULL, 8555, NULL, NULL),
(6, 'stud 2 project', 'kregverjg rehjg ergjhrg rehjg regjr vhdmd vrhr ghrg rhgjr grhj', 2, NULL, 5222, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `stud_id` (`stud_id`),
  ADD KEY `company_id` (`company_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`stud_id`) REFERENCES `student` (`stud_id`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
