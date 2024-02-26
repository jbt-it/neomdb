SET FOREIGN_KEY_CHECKS = 0;

--
-- Daten für Tabelle `event`
--

INSERT INTO `event` (`eventID`, `eventname`, `beschreibung`, `datum`, `ende`, `anmeldungVon`, `anmeldungBis`, `ort`, `startzeit`, `endzeit`, `ww`, `netzwerk`, `maximaleTeilnehmer`, `jbtgoes`, `sonstige`) VALUES
(5, 'Working-Weekend', 'WORK HARD, PARTY HARD!!!!', '2013-11-15', '2013-11-17', NULL, '2013-11-12 20:00:00', 'Nähe Geislingen an der Steige (Freizeitheim Stötten)', NULL, NULL, 1, 0, NULL, 0, 0),
(7, 'Jahreshauptversammlung/Weihnachtsfeier', '', '2013-12-14', '2013-12-15', NULL, '2013-12-09 22:00:00', 'Euro Forum Katharinasaal/TMS', '18:00', '09:00', 0, 0, NULL, 0, 0),
(8, 'JBT goes Soccerhall', 'JBT internes Fußballtunier', '2013-12-13', '2013-12-13', NULL, '2013-12-10 20:00:00', 'Raum Stuttgart -  genaue Infos folgen', '18:30', '21:30', 0, 0, NULL, 0, 0),
(10, 'Working-Weekend', 'WORK HARD, PARTY HARD!!!!', '2014-05-02', '2014-05-04', NULL, '2014-04-30 20:00:00', 'Sulz am Neckar', NULL, NULL, 1, 0, NULL, 0, 0),
(20, 'TED Mannheim', '', '2014-04-11', '2014-04-12', NULL, '2014-03-30 10:00:00', NULL, '10:00', '15.00', 0, 0, NULL, 0, 0),
(33, 'JBT goes Public Viewing', '', '2014-06-16', '2014-06-16', NULL, '2014-06-13 18:00:00', NULL, '18:00', '22:00', 0, 0, NULL, 0, 0),
(143, 'Young Business Network', 'Die Veranstaltungsreihe „Young Business Husslers“ ist als Erfahrungsaustausch für Existenzgründer und Jungunternehmer konzipiert.\r\n\r\nNeben ausgewählten Fachvorträgen besteht die Möglichkeit, beim Elevator-Pitch das eigene Unternehmen vorzustellen und Fragen an die Teilnehmer zu richten.\r\n\r\nUnseren „Ich suche/Ich biete-Marktplatz“ können Sie nutzen, um erste Geschäftskontakte zu knüpfen und diese beim anschließenden gemütlichen Ausklang zu vertiefen.\r\n\r\nNatürlich bleibt genügend Zeit für den Erfahrungsaustausch und das persönliche Networken. Wir freuen uns auf einen spannenden und ergebnisreichen Abend mit Ihnen.', '2016-05-30', '2016-05-30', NULL, '2016-05-28 16:00:00', 'IHK Region Stuttgart Langestraße 4 70987 Stuttgart', '19:00', '22:00', 0, 1, NULL, 0, 0),
(266, 'Working-Weekend', '', '2018-11-16', '2018-11-18', NULL, '2018-11-14 23:59:00', 'Tübinger Straße 12, 61482 Blockhausen', NULL, NULL, 1, 0, NULL, 0, 0),
(295, 'JBT goes Sprungbude', 'Wir möchten mit Euch in die weltweit größte Trampolinhalle gehen', '2019-05-31', '2019-05-31', NULL, '2019-05-27 21:30:00', '\"Sprungbude Filderstadt\" / Im Supergau 16, 70354 Filderstadt', '15:30', NULL, 0, 0, NULL, 0, 0);

--
-- Daten für Tabelle `mitglied_has_event`
--

INSERT INTO `mitglied_has_event` (`event_eventID`, `mitglied_mitgliedID`, `rolle`, `anmeldezeitpunkt`) VALUES
(7, 8111, 'Organisator', '2024-02-22 01:09:14'),
(7, 8324, 'Teilnehmer', '2024-02-22 01:09:14'),
(7, 8478, 'Teilnehmer', '2024-02-22 01:09:14'),
(8, 8111, 'Teilnehmer', '2024-02-22 01:09:14'),
(8, 8320, 'Teilnehmer', '2024-02-22 01:09:14'),
(20, 8324, 'Teilnehmer', '2024-02-22 01:09:14'),
(33, 8167, 'Teilnehmer', '2024-02-22 01:09:14'),
(143, 8167, 'Teilnehmer', '2024-02-22 01:09:14'),
(295, 8748, 'Teilnehmer', '2024-02-22 01:09:14');

--
-- Daten für Tabelle `mitglied_has_eventww`
--

INSERT INTO `mitglied_has_eventww` (`event_eventID`, `mitglied_mitgliedID`, `anreise`, `abreise`, `auto`, `plaetze`, `vegetarier`, `kommentar`) VALUES
(5, 8111, 'FrA', 'SaA', 1, 2, 0, ''),
(5, 8167, 'FrA', 'SaM', 0, 0, 0, ''),
(5, 8320, 'FrA', 'SaA', 0, 0, 0, 'Ich halte den WS Angebot II'),
(5, 8324, 'FrA', 'SaM', 0, 0, 0, ''),
(5, 8338, 'FrA', 'SaM', 0, 0, 0, ''),
(5, 8478, 'FrA', 'SaM', 0, 0, 0, ''),
(10, 8111, 'FrA', 'SaM', 0, 0, 0, ''),
(266, 8167, 'FrA', 'SaM', 0, 0, 0, '');

SET FOREIGN_KEY_CHECKS = 1;