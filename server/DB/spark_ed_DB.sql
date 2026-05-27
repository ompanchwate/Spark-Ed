-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2026 at 09:54 AM
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
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `company_id` int(11) NOT NULL,
  `company_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`company_id`, `company_name`, `email`, `password`, `phone`, `location`, `description`, `createdAt`) VALUES
(1, 'cencora', 'cencora@gmail.com', '123456', '+917507224919', 'rgergregre', 'tegregregergeg', '2026-04-08 12:03:00');

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `id` bigint(20) NOT NULL,
  `funding_request_id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `meet_link` varchar(500) NOT NULL,
  `date_time` datetime NOT NULL,
  `meeting_status` enum('SCHEDULED','ONGOING','COMPLETED','CANCELLED','MISSED') DEFAULT 'SCHEDULED',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`id`, `funding_request_id`, `summary`, `meet_link`, `date_time`, `meeting_status`, `created_at`, `updated_at`) VALUES
(1, 2, 'Meeting', 'https://meet.google.com/gku-ncwc-kmc', '1212-12-12 12:01:00', 'SCHEDULED', '2026-05-27 06:54:47', '2026-05-27 06:54:47'),
(2, 2, 'Meeting', 'https://meet.google.com/btu-uekf-ozq', '2333-04-04 03:34:00', 'SCHEDULED', '2026-05-27 07:22:21', '2026-05-27 07:22:21'),
(3, 7, 'Meeting', 'https://meet.google.com/urb-ixoo-qin', '2026-05-29 12:34:00', 'COMPLETED', '2026-05-27 07:40:14', '2026-05-27 07:43:59');

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
(8, 'new project 27/05', 'QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQqqqq wwwwwwwwwwwwwwwwwwwwwwwww ffffffffffffffffffffffffffffffffffff', 1, 'funded', 2345, 2345, 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_funding_requests`
--

CREATE TABLE `project_funding_requests` (
  `id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `amount` int(11) NOT NULL,
  `negotiate` tinyint(1) DEFAULT NULL,
  `negotiated_amount` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_funding_requests`
--

INSERT INTO `project_funding_requests` (`id`, `company_id`, `project_id`, `message`, `amount`, `negotiate`, `negotiated_amount`, `status`, `timestamp`) VALUES
(2, 2, 1, 'We want to invest ₹2500 in this project. hbbkg trhtjkh tjhkrt htrhtrlht hkrth klgse elfhreh eh', 2500, 1, 0, 'pending', '2025-06-27 10:14:16'),
(7, 1, 8, 'We want to invest ₹1234 in this project. 5y5y54y54y', 1234, 1, 2345, 'approved', '2026-05-27 13:04:30');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `stud_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` varchar(20) DEFAULT 'student',
  `phone` varchar(15) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `education` varchar(500) NOT NULL,
  `skills` varchar(500) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`stud_id`, `name`, `email`, `password`, `type`, `phone`, `gender`, `education`, `skills`, `createdAt`) VALUES
(1, 'Om panchwate', 'admin@gmail.com', '123456', 'student', '+917507224919', 'male', '[{\"degree\":\"Bte\",\"college\":\"rkgerhekr\",\"startYear\":\"2022\",\"endYear\":\"2025\",\"location\":\"Pune\"},{\"degree\":\"rgbrekg\",\"college\":\"jgrbekgr\",\"startYear\":\"444\",\"endYear\":\"444\",\"location\":\";fmreg\"},{\"degree\":\"jkgenrgre\",\"college\":\"jkbgregb\",\"startYear\":\"jnrgoer\",\"endYear\":\"wekjgrb\",\"location\":\"kgbrwgb\"}]', '[\"Node.js\",\"new\",\"php\",\"databricks\"]', '2026-04-08 11:54:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`company_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_meeting_funding_request` (`funding_request_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `stud_id` (`stud_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `project_funding_requests`
--
ALTER TABLE `project_funding_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`stud_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `project_funding_requests`
--
ALTER TABLE `project_funding_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `stud_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `fk_meeting_funding_request` FOREIGN KEY (`funding_request_id`) REFERENCES `project_funding_requests` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
