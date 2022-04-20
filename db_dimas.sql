/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 10.1.38-MariaDB : Database - db_dimas
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_dimas` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `db_dimas`;

/*Table structure for table `barang` */

DROP TABLE IF EXISTS `barang`;

CREATE TABLE `barang` (
  `id_barang` int(11) NOT NULL AUTO_INCREMENT,
  `barcode` char(50) NOT NULL,
  `nama` varchar(250) NOT NULL,
  `harga` char(100) NOT NULL,
  `stok` char(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_barang`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

/*Data for the table `barang` */

insert  into `barang`(`id_barang`,`barcode`,`nama`,`harga`,`stok`) values 
(13,'8996001354124','Beng-Beng','1500','188'),
(14,'8994834006012','Mie Gemez','1000','11'),
(15,'8994096219434','Lemon Tea  330 ML','5000','206');

/*Table structure for table `beli_barang` */

DROP TABLE IF EXISTS `beli_barang`;

CREATE TABLE `beli_barang` (
  `id_beli_barang` int(11) NOT NULL AUTO_INCREMENT,
  `id_barang` int(11) NOT NULL,
  `id_pembelian` int(11) NOT NULL,
  `banyak_beli` char(20) NOT NULL,
  `harga_beli` char(100) NOT NULL,
  PRIMARY KEY (`id_beli_barang`),
  KEY `id_barang` (`id_barang`),
  KEY `id_pembelian` (`id_pembelian`),
  CONSTRAINT `beli_barang_ibfk_2` FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id_barang`),
  CONSTRAINT `beli_barang_ibfk_3` FOREIGN KEY (`id_pembelian`) REFERENCES `pembelian` (`id_pembelian`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=latin1;

/*Data for the table `beli_barang` */

insert  into `beli_barang`(`id_beli_barang`,`id_barang`,`id_pembelian`,`banyak_beli`,`harga_beli`) values 
(44,15,66,'10','4000'),
(46,14,66,'1','500'),
(47,13,68,'100','1000'),
(48,15,68,'200','4000'),
(50,14,70,'10','1000'),
(51,13,70,'100','1000');

/*Table structure for table `jual_barang` */

DROP TABLE IF EXISTS `jual_barang`;

CREATE TABLE `jual_barang` (
  `id_jual_barang` int(11) NOT NULL AUTO_INCREMENT,
  `id_penjualan` int(11) NOT NULL,
  `id_barang` int(11) NOT NULL,
  `banyak_jual` char(20) NOT NULL,
  `harga_jual` char(50) NOT NULL,
  PRIMARY KEY (`id_jual_barang`),
  KEY `id_barang` (`id_barang`),
  KEY `id_penjualan` (`id_penjualan`),
  CONSTRAINT `jual_barang_ibfk_2` FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id_barang`),
  CONSTRAINT `jual_barang_ibfk_3` FOREIGN KEY (`id_penjualan`) REFERENCES `penjualan` (`id_penjualan`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;

/*Data for the table `jual_barang` */

insert  into `jual_barang`(`id_jual_barang`,`id_penjualan`,`id_barang`,`banyak_jual`,`harga_jual`) values 
(94,37,15,'1','5000'),
(95,37,15,'1','5000'),
(96,37,15,'1','5000'),
(97,37,15,'1','5000'),
(98,40,13,'1','1500'),
(99,40,13,'11','1500');

/*Table structure for table `pembelian` */

DROP TABLE IF EXISTS `pembelian`;

CREATE TABLE `pembelian` (
  `id_pembelian` int(11) NOT NULL AUTO_INCREMENT,
  `kode` char(14) DEFAULT NULL,
  `waktu` datetime NOT NULL,
  `id_supplier` int(11) NOT NULL,
  `id_pengguna` int(11) NOT NULL,
  PRIMARY KEY (`id_pembelian`),
  KEY `id_pengguna` (`id_pengguna`),
  KEY `id_supplier` (`id_supplier`),
  CONSTRAINT `pembelian_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`),
  CONSTRAINT `pembelian_ibfk_2` FOREIGN KEY (`id_supplier`) REFERENCES `supplier` (`id_supplier`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;

/*Data for the table `pembelian` */

insert  into `pembelian`(`id_pembelian`,`kode`,`waktu`,`id_supplier`,`id_pengguna`) values 
(22,'20220307110300','2022-03-07 11:03:00',3,15),
(39,'20220307140307','2022-03-07 14:03:07',4,15),
(40,'20220308070325','2022-03-08 07:03:25',3,15),
(44,'20220308080351','2022-03-08 08:03:51',3,15),
(45,'20220308080351','2022-03-08 08:03:51',4,15),
(46,'20220308080358','2022-03-08 08:03:58',4,15),
(47,'20220308080359','2022-03-08 08:03:59',4,15),
(48,'20220310105621','2022-03-10 10:56:21',3,14),
(49,'20220310105648','2022-03-10 10:56:48',3,14),
(50,'20220310110210','2022-03-10 11:02:10',3,14),
(51,'20220310110327','2022-03-10 11:03:27',3,14),
(52,'20220311084047','2022-03-11 08:40:47',3,14),
(53,'20220312135528','2022-03-12 13:55:28',3,14),
(54,'20220314125515','2022-03-14 12:55:15',3,14),
(55,'20220314125704','2022-03-14 12:57:04',3,14),
(56,'20220315103425','2022-03-15 10:34:25',4,14),
(57,'20220317102929','2022-03-17 10:29:29',3,14),
(58,'20220317103006','2022-03-17 10:30:06',4,14),
(59,'20220317103311','2022-03-17 10:33:11',4,14),
(60,'20220317110319','2022-03-17 11:03:19',3,14),
(61,'20220317115702','2022-03-17 11:57:02',4,14),
(62,'20220317123246','2022-03-17 12:32:46',4,14),
(63,'20220319090117','2022-03-19 09:01:17',3,14),
(64,'20220319090239','2022-03-19 09:02:39',4,14),
(65,'20220321094749','2022-03-21 09:47:49',3,14),
(66,'20220321100832','2022-03-21 10:08:32',3,14),
(67,'20220321100907','2022-03-21 10:09:07',4,14),
(68,'20220322072506','2022-03-22 07:25:06',4,14),
(70,'20220324122439','2022-03-24 12:24:39',4,14);

/*Table structure for table `pengguna` */

DROP TABLE IF EXISTS `pengguna`;

CREATE TABLE `pengguna` (
  `id_pengguna` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(100) NOT NULL,
  `password` char(100) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `status` enum('1','0') DEFAULT '1',
  `level` enum('1','2','3') NOT NULL,
  PRIMARY KEY (`id_pengguna`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

/*Data for the table `pengguna` */

insert  into `pengguna`(`id_pengguna`,`username`,`password`,`nama`,`status`,`level`) values 
(14,'yeji','86369d62d2b7d5b2d74d3b9ef346e3fa','Hwang Yeji','1','2'),
(15,'jiso','7291db7da4e1d3ad82d129da6c6a2c0a','Kim Jiso','1','3'),
(18,'winter','f6432274349b5cb93433f8ed886a3f37','Kim Minjeong','1','1'),
(19,'dimas','5a378f8490c8d6af8647a753812f6e31','Dimas Triana','0','2');

/*Table structure for table `penjualan` */

DROP TABLE IF EXISTS `penjualan`;

CREATE TABLE `penjualan` (
  `id_penjualan` int(11) NOT NULL AUTO_INCREMENT,
  `kode` char(14) DEFAULT NULL,
  `waktu` datetime NOT NULL,
  `id_pengguna` int(11) NOT NULL,
  PRIMARY KEY (`id_penjualan`),
  KEY `id_pengguna` (`id_pengguna`),
  CONSTRAINT `penjualan_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;

/*Data for the table `penjualan` */

insert  into `penjualan`(`id_penjualan`,`kode`,`waktu`,`id_pengguna`) values 
(37,'20220322073654','2022-03-22 07:36:54',15),
(38,'20220323093944','2022-03-23 09:39:44',15),
(40,'20220324121110','2022-03-24 12:11:10',15);

/*Table structure for table `supplier` */

DROP TABLE IF EXISTS `supplier`;

CREATE TABLE `supplier` (
  `id_supplier` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(200) NOT NULL,
  `alamat` varchar(250) NOT NULL,
  `telp` char(15) NOT NULL,
  PRIMARY KEY (`id_supplier`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `supplier` */

insert  into `supplier`(`id_supplier`,`nama`,`alamat`,`telp`) values 
(3,'Toko Amanah','JL.Anggrek','08988224023'),
(4,'SM TWON','JL.mawar','0090909');

/* Trigger structure for table `beli_barang` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `barang_beli_tambah` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `barang_beli_tambah` AFTER INSERT ON `beli_barang` FOR EACH ROW BEGIN
	UPDATE barang SET stok=stok+new.`banyak_beli` WHERE id_barang=new.`id_barang`;
    END */$$


DELIMITER ;

/* Trigger structure for table `beli_barang` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `barang_beli_batal` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `barang_beli_batal` BEFORE DELETE ON `beli_barang` FOR EACH ROW BEGIN
	update barang SET stok=stok-old.`banyak_beli` WHERE id_barang=old.`id_barang`;
    END */$$


DELIMITER ;

/* Trigger structure for table `jual_barang` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `barang_jual_tambah` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `barang_jual_tambah` AFTER INSERT ON `jual_barang` FOR EACH ROW BEGIN
	update barang set stok=stok-new.banyak_jual where id_barang=new.id_barang;
    END */$$


DELIMITER ;

/* Trigger structure for table `jual_barang` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `barang_jual_hapus` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `barang_jual_hapus` BEFORE DELETE ON `jual_barang` FOR EACH ROW BEGIN
	update barang set stok=stok+old.banyak_jual where id_barang=old.id_barang;
    END */$$


DELIMITER ;

/* Trigger structure for table `pembelian` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `beli_barang_hapus` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `beli_barang_hapus` BEFORE DELETE ON `pembelian` FOR EACH ROW BEGIN
	delete from beli_barang where id_pembelian=old.id_pembelian;
    END */$$


DELIMITER ;

/* Trigger structure for table `penjualan` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `penjualan_hapus` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `penjualan_hapus` BEFORE DELETE ON `penjualan` FOR EACH ROW BEGIN
	delete from jual_barang where id_penjualan=old.id_penjualan;
    END */$$


DELIMITER ;

/*Table structure for table `barang_beli_list` */

DROP TABLE IF EXISTS `barang_beli_list`;

/*!50001 DROP VIEW IF EXISTS `barang_beli_list` */;
/*!50001 DROP TABLE IF EXISTS `barang_beli_list` */;

/*!50001 CREATE TABLE  `barang_beli_list`(
 `id_beli_barang` int(11) ,
 `id_barang` int(11) ,
 `id_pembelian` int(11) ,
 `banyak_beli` char(20) ,
 `harga_beli` char(100) ,
 `jumlah` double ,
 `barcode` char(50) ,
 `nama` varchar(250) 
)*/;

/*Table structure for table `pembelian_list` */

DROP TABLE IF EXISTS `pembelian_list`;

/*!50001 DROP VIEW IF EXISTS `pembelian_list` */;
/*!50001 DROP TABLE IF EXISTS `pembelian_list` */;

/*!50001 CREATE TABLE  `pembelian_list`(
 `id_pembelian` int(11) ,
 `kode` char(14) ,
 `waktu` datetime ,
 `nama` varchar(200) ,
 `total` double 
)*/;

/*Table structure for table `penjualan_list` */

DROP TABLE IF EXISTS `penjualan_list`;

/*!50001 DROP VIEW IF EXISTS `penjualan_list` */;
/*!50001 DROP TABLE IF EXISTS `penjualan_list` */;

/*!50001 CREATE TABLE  `penjualan_list`(
 `id_penjualan` int(11) ,
 `kode` char(14) ,
 `waktu` datetime ,
 `id_pengguna` int(11) ,
 `nama` varchar(150) ,
 `total` double 
)*/;

/*Table structure for table `struk_jual` */

DROP TABLE IF EXISTS `struk_jual`;

/*!50001 DROP VIEW IF EXISTS `struk_jual` */;
/*!50001 DROP TABLE IF EXISTS `struk_jual` */;

/*!50001 CREATE TABLE  `struk_jual`(
 `id_jual_barang` int(11) ,
 `id_penjualan` int(11) ,
 `id_barang` int(11) ,
 `banyak_jual` char(20) ,
 `harga_jual` char(50) ,
 `jumlah` double ,
 `barcode` char(50) ,
 `nama` varchar(250) 
)*/;

/*View structure for view barang_beli_list */

/*!50001 DROP TABLE IF EXISTS `barang_beli_list` */;
/*!50001 DROP VIEW IF EXISTS `barang_beli_list` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `barang_beli_list` AS (select `beli_barang`.`id_beli_barang` AS `id_beli_barang`,`beli_barang`.`id_barang` AS `id_barang`,`beli_barang`.`id_pembelian` AS `id_pembelian`,`beli_barang`.`banyak_beli` AS `banyak_beli`,`beli_barang`.`harga_beli` AS `harga_beli`,(`beli_barang`.`banyak_beli` * `beli_barang`.`harga_beli`) AS `jumlah`,`barang`.`barcode` AS `barcode`,`barang`.`nama` AS `nama` from (`beli_barang` join `barang`) where (`beli_barang`.`id_barang` = `barang`.`id_barang`)) */;

/*View structure for view pembelian_list */

/*!50001 DROP TABLE IF EXISTS `pembelian_list` */;
/*!50001 DROP VIEW IF EXISTS `pembelian_list` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `pembelian_list` AS (select `pembelian`.`id_pembelian` AS `id_pembelian`,`pembelian`.`kode` AS `kode`,`pembelian`.`waktu` AS `waktu`,`supplier`.`nama` AS `nama`,sum((`beli_barang`.`banyak_beli` * `beli_barang`.`harga_beli`)) AS `total` from ((`supplier` join `pembelian`) join `beli_barang`) where ((`supplier`.`id_supplier` = `pembelian`.`id_supplier`) and (`pembelian`.`id_pembelian` = `beli_barang`.`id_pembelian`)) group by `pembelian`.`id_pembelian`) */;

/*View structure for view penjualan_list */

/*!50001 DROP TABLE IF EXISTS `penjualan_list` */;
/*!50001 DROP VIEW IF EXISTS `penjualan_list` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `penjualan_list` AS (select `penjualan`.`id_penjualan` AS `id_penjualan`,`penjualan`.`kode` AS `kode`,`penjualan`.`waktu` AS `waktu`,`penjualan`.`id_pengguna` AS `id_pengguna`,`pengguna`.`nama` AS `nama`,sum((`jual_barang`.`banyak_jual` * `jual_barang`.`harga_jual`)) AS `total` from ((`penjualan` join `jual_barang`) join `pengguna`) where ((`penjualan`.`id_penjualan` = `jual_barang`.`id_penjualan`) and (`pengguna`.`id_pengguna` = `penjualan`.`id_pengguna`)) group by `penjualan`.`id_penjualan`) */;

/*View structure for view struk_jual */

/*!50001 DROP TABLE IF EXISTS `struk_jual` */;
/*!50001 DROP VIEW IF EXISTS `struk_jual` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `struk_jual` AS (select `jual_barang`.`id_jual_barang` AS `id_jual_barang`,`jual_barang`.`id_penjualan` AS `id_penjualan`,`jual_barang`.`id_barang` AS `id_barang`,`jual_barang`.`banyak_jual` AS `banyak_jual`,`jual_barang`.`harga_jual` AS `harga_jual`,(`jual_barang`.`banyak_jual` * `jual_barang`.`harga_jual`) AS `jumlah`,`barang`.`barcode` AS `barcode`,`barang`.`nama` AS `nama` from (`barang` join `jual_barang`) where (`barang`.`id_barang` = `jual_barang`.`id_barang`)) */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
