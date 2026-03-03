-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: tuMascota
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adopcion`
--

DROP TABLE IF EXISTS `adopcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adopcion` (
  `idAdopcion` int(11) NOT NULL AUTO_INCREMENT,
  `idUsuario` int(11) NOT NULL,
  `nombreMascota` varchar(100) NOT NULL,
  `especie` varchar(50) NOT NULL,
  `raza` varchar(50) DEFAULT NULL,
  `edad` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `contacto` varchar(200) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `estado` enum('disponible','adoptada') DEFAULT 'disponible',
  `fechaPublicacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`idAdopcion`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `adopcion_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adopcion`
--

LOCK TABLES `adopcion` WRITE;
/*!40000 ALTER TABLE `adopcion` DISABLE KEYS */;
INSERT INTO `adopcion` VALUES (4,15,'si','gato','miau','','','5556⁶6666',NULL,'adoptada','2026-02-26 13:19:09');
/*!40000 ALTER TABLE `adopcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mascota`
--

DROP TABLE IF EXISTS `mascota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mascota` (
  `idMascota` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `especie` varchar(100) DEFAULT NULL,
  `raza` varchar(100) DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `idDueno` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idMascota`),
  KEY `idDueno` (`idDueno`),
  CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`idDueno`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascota`
--

LOCK TABLES `mascota` WRITE;
/*!40000 ALTER TABLE `mascota` DISABLE KEYS */;
INSERT INTO `mascota` VALUES (20,'Pato Lucas','Ave','Pato','2026-02-20',15,'mascota_69a054d2b1d3a.jpg'),(22,'daniel','Perro','Bulldog','2026-02-26',15,'mascota_69a06aa9352b9.jpg');
/*!40000 ALTER TABLE `mascota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paseo`
--

DROP TABLE IF EXISTS `paseo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paseo` (
  `idPaseo` int(11) NOT NULL AUTO_INCREMENT,
  `idMascota` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `duracionMinutos` int(11) DEFAULT 0,
  `distanciaKm` decimal(5,2) DEFAULT NULL,
  `lugar` varchar(200) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`idPaseo`),
  KEY `idMascota` (`idMascota`),
  CONSTRAINT `paseo_ibfk_1` FOREIGN KEY (`idMascota`) REFERENCES `mascota` (`idMascota`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paseo`
--

LOCK TABLES `paseo` WRITE;
/*!40000 ALTER TABLE `paseo` DISABLE KEYS */;
INSERT INTO `paseo` VALUES (11,20,'2026-02-26',2,2.00,'haha','ha');
/*!40000 ALTER TABLE `paseo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (15,'Nabil','nabil@gmail.com','$2y$10$dmHF1Srg8YW4j4md1tfHFuu281YQYjC0mG/9VO6d9h9gq75OXn/X.','633072374','Granada','España');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacuna`
--

DROP TABLE IF EXISTS `vacuna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vacuna` (
  `idVacuna` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`idVacuna`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacuna`
--

LOCK TABLES `vacuna` WRITE;
/*!40000 ALTER TABLE `vacuna` DISABLE KEYS */;
INSERT INTO `vacuna` VALUES (1,'Rabia','Vacuna obligatoria anual contra la rabia'),(2,'Parvovirus','Protege contra el parvovirus canino'),(3,'Moquillo','Protección contra el moquillo canino'),(4,'Tos de las perreras','Vacuna recomendada para perros sociables');
/*!40000 ALTER TABLE `vacuna` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacunacion_mascota`
--

DROP TABLE IF EXISTS `vacunacion_mascota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vacunacion_mascota` (
  `idVacunacion` int(11) NOT NULL AUTO_INCREMENT,
  `fechaAplicacion` date NOT NULL,
  `fechaProxima` date DEFAULT NULL,
  `idMascota` int(11) DEFAULT NULL,
  `idVacuna` int(11) DEFAULT NULL,
  PRIMARY KEY (`idVacunacion`),
  KEY `idMascota` (`idMascota`),
  KEY `idVacuna` (`idVacuna`),
  CONSTRAINT `vacunacion_mascota_ibfk_1` FOREIGN KEY (`idMascota`) REFERENCES `mascota` (`idMascota`) ON DELETE CASCADE,
  CONSTRAINT `vacunacion_mascota_ibfk_2` FOREIGN KEY (`idVacuna`) REFERENCES `vacuna` (`idVacuna`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacunacion_mascota`
--

LOCK TABLES `vacunacion_mascota` WRITE;
/*!40000 ALTER TABLE `vacunacion_mascota` DISABLE KEYS */;
INSERT INTO `vacunacion_mascota` VALUES (30,'2026-02-26','2026-02-27',20,3),(32,'2026-02-26','2026-02-28',22,2);
/*!40000 ALTER TABLE `vacunacion_mascota` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-27 13:08:35
