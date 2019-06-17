-- MySQL dump 10.13  Distrib 5.7.26, for Linux (x86_64)
--
-- Host: localhost    Database: mlbfd
-- ------------------------------------------------------
-- Server version	5.7.26-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `park_sw_data`
--

DROP TABLE IF EXISTS `park_sw_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `park_sw_data` (
  `Team_ID` int(11) NOT NULL,
  `Left_HR` double NOT NULL,
  `Left_Triple` double NOT NULL,
  `Left_Double` double NOT NULL,
  `Left_Single` double NOT NULL,
  `Left_AVG` double NOT NULL,
  `Left_R` double NOT NULL,
  `Right_HR` double NOT NULL,
  `Right_Triple` double NOT NULL,
  `Right_Double` double NOT NULL,
  `Right_Single` double NOT NULL,
  `Right_R` double NOT NULL,
  `Right_AVG` double NOT NULL,
  PRIMARY KEY (`Team_ID`),
  CONSTRAINT `teamidparkfactor` FOREIGN KEY (`Team_ID`) REFERENCES `teams` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `park_sw_data`
--

LOCK TABLES `park_sw_data` WRITE;
/*!40000 ALTER TABLE `park_sw_data` DISABLE KEYS */;
INSERT INTO `park_sw_data` VALUES (1,0.82,0.74,1.04,1.05,1.02,0.99,0.9,0.73,1,1.05,1.06,1.02),(2,0.85,1.25,1.08,0.95,0.98,0.92,0.85,1.27,1.01,0.93,0.9,0.92),(3,1.07,0.52,0.88,0.97,0.95,0.96,1.04,0.87,0.87,1.01,0.99,0.97),(4,0.95,0.45,1.01,0.99,0.96,0.88,1.13,0.41,0.99,0.97,0.98,0.97),(5,1.02,0.95,0.86,0.96,0.95,0.94,1.05,0.63,0.94,0.94,0.88,0.93),(6,1.15,1.97,1.09,0.97,1,1.14,1.07,1.65,1.22,1.07,1.12,1.05),(7,1.2,0.78,0.89,0.95,0.98,0.88,0.87,1.03,0.84,0.98,0.88,0.96),(8,0.8,0.9,0.9,1.04,0.99,0.89,1.03,0.59,1.04,1.01,0.98,0.98),(9,1.03,1.01,1.15,0.95,0.99,1.02,0.99,1.02,1.15,1.01,1,0.98),(10,0.71,0.62,0.98,0.95,0.97,0.82,0.88,1.11,0.72,0.97,0.84,0.89),(11,1.26,0.89,0.9,0.96,1,1.01,1.25,1.06,0.88,0.91,0.96,0.97),(12,0.94,1.18,0.93,0.97,0.94,0.98,0.79,0.63,1.1,1.03,0.87,0.99),(13,0.76,0.96,0.97,1.11,1,0.99,0.61,1.58,1.14,1,0.93,0.94),(14,1.26,0.63,0.89,1.06,1.01,1.12,1.3,0.67,0.88,0.93,1.04,1.03),(15,1.03,1.12,1.12,1.09,1.06,1.13,0.78,1.41,1.58,1.06,1,1.06),(16,1.15,0.85,0.95,1.06,1.07,1.1,1.02,0.63,1.16,1.06,0.98,1.09),(17,1.18,1.52,1.29,1.08,1.18,1.28,1.15,1.74,1.27,1.11,1.27,1.19),(18,1.05,1.5,1.08,1.04,1.05,1.09,1.03,1.47,0.86,0.97,0.97,0.98),(19,0.97,0.58,0.79,0.9,0.88,0.87,0.88,0.71,0.84,0.92,0.87,0.92),(20,0.95,0.51,0.98,1.02,0.97,0.98,1.15,0.73,1.26,1.06,1.25,1.06),(21,1.11,1.55,0.94,0.98,1.01,1.09,0.84,0.97,1.1,1.01,0.99,1.03),(22,0.91,1.03,0.86,0.99,0.99,0.89,0.87,1,0.86,0.96,0.95,0.93),(23,1.06,1.49,1.17,1.08,1.07,1.21,1.17,1.74,0.97,1.08,1.19,1.12),(24,1.16,0.97,1.1,0.89,1,0.96,1.22,1.01,0.86,0.94,1.12,0.97),(25,0.74,1.23,1.08,1.05,1,0.9,0.98,0.71,1.06,1.02,0.99,1.03),(26,1.27,0.82,0.89,1.01,1,1.02,1.07,0.63,0.88,1.06,0.96,1.01),(27,1.07,0.9,1.16,1.05,1.03,1.02,0.98,1.27,1.03,1.02,1.03,1.01),(28,0.84,1.37,1.19,0.96,0.98,1.03,0.79,1.5,1.04,1.1,1.02,1.06),(29,1.03,0.79,0.91,1,1.01,0.95,1.22,1.06,0.79,0.92,0.98,0.95),(30,1.02,0.79,1.08,0.95,0.98,1.02,1.23,0.99,0.94,0.95,0.98,0.99);
/*!40000 ALTER TABLE `park_sw_data` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-17 12:31:03
