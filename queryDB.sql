--
-- Table structure for table `accesos`
--

DROP TABLE IF EXISTS `accesos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accesos` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(15) DEFAULT NULL,
  `short` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accesos`
--

LOCK TABLES `accesos` WRITE;
/*!40000 ALTER TABLE `accesos` DISABLE KEYS */;
INSERT INTO `accesos` VALUES (1,'alta','a'),(2,'baja','b'),(3,'modificar','m'),(4,'lista','c');
/*!40000 ALTER TABLE `accesos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ayuda`
--

DROP TABLE IF EXISTS `ayuda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ayuda` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `numero` int(4) DEFAULT NULL,
  `titulo` varchar(70) DEFAULT NULL,
  `texto` varchar(8000) DEFAULT NULL,
  `activa` tinyint(1) DEFAULT NULL,
  `route` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ayuda`
--

LOCK TABLES `ayuda` WRITE;
/*!40000 ALTER TABLE `ayuda` DISABLE KEYS */;
INSERT INTO `ayuda` VALUES (1,1,'Usuarios','usuarios',1,'usuarios'),(2,2,'Permisos','accesos',1,'accesos');
/*!40000 ALTER TABLE `ayuda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventos` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `fecha_hora` datetime NOT NULL,
  `evento` varchar(80) NOT NULL,
  `observ` varchar(80) NOT NULL,
  `idusuario` int(4) NOT NULL,
  `tabla` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `secr`
--

DROP TABLE IF EXISTS `secr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secr` (
  `unica` int(4) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(25) DEFAULT NULL,
  `clave` varchar(60) DEFAULT NULL,
  `mail` varchar(80) NOT NULL,
  `niveles` varchar(200) DEFAULT NULL,
  `alta` datetime DEFAULT NULL,
  `baja` datetime DEFAULT NULL,
  `activa` int(11) DEFAULT NULL,
  PRIMARY KEY (`unica`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secr`
--

LOCK TABLES `secr` WRITE;
/*!40000 ALTER TABLE `secr` DISABLE KEYS */;
INSERT INTO `secr` VALUES (1,'franco','$2a$10$gXWk4O1ABMbYkuXxtVqwt.Vy3Yq19DSY2m4m0YWGiN0XCrL0Btr3W','franco@mail.com','Administrador','2017-10-24 00:00:00',NULL,1);
/*!40000 ALTER TABLE `secr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `secr2`
--

DROP TABLE IF EXISTS `secr2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secr2` (
  `unica` int(4) NOT NULL,
  `menu` int(2) DEFAULT NULL,
  `a` tinyint(1) DEFAULT NULL,
  `b` tinyint(1) DEFAULT NULL,
  `c` tinyint(1) DEFAULT NULL,
  `m` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secr2`
--

LOCK TABLES `secr2` WRITE;
/*!40000 ALTER TABLE `secr2` DISABLE KEYS */;
INSERT INTO `secr2` VALUES (1,1,0,0,0,0),(1,2,0,0,0,0),(1,3,0,0,0,0),(1,4,0,0,0,0);
/*!40000 ALTER TABLE `secr2` ENABLE KEYS */;
UNLOCK TABLES;