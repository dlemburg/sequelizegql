-- Authors
INSERT INTO "public"."author"
  ("id", "name", "birth_date")
VALUES
  (1, 'Howard Phillips Lovecraft', '1890-08-20 00:00:00'),
  (2, 'William Shakespeare', '1564-04-26 00:00:00'),
  (3, 'Emily Elizabeth Dickinson', '1830-12-10 00:00:00'),
  (4, 'Arthur Conan Doyle', '1859-05-22 00:00:00');

-- Categories
INSERT INTO "public"."category"
  ("id", "name")
VALUES
  (1, 'horror'),
  (2, 'drama'),
  (3, 'tragedy'),
  (4, 'comedy'),
  (5, 'poem'),
  (6, 'mystery');

-- Cities
INSERT INTO "public"."city"
  ("id", "postal_code", "name")
VALUES
  (1, '33146', 'Miami'),
  (2, '47305', 'Indianapolis');

-- Libraries
INSERT INTO "public"."library"
  ("id", "city_id", "name", "address", "description", "status")
VALUES
  (1, 1, 'Richter Library', '1300 Memorial Dr, Coral Gables,', 'Principal library', 'ACTIVE'),
  (2, 2, 'Carnegie Library', '301 EAST JACKSON STREET', 'Carnegie princial', 'ACTIVE');

-- Books
INSERT INTO "public"."book"
  ("id", "isbn", "title", "category_id")
VALUES
  (1, '0140623612', 'The Hound of the Baskervilles', 6),
  (2, '0143427156', 'Merchant Of Venice', 4),
  (3, '014342730x', 'Macbeth', 3),
  (4, '0606043918', 'I''m Nobody! Who Are You?', 5),
  (5, '0821216481', 'Acts Of Light', 5),
  (6, '084419512x', 'Tales Of The Cthulhu Mythos Volume 2', 1),
  (7, '1121427634', 'Beyond The Wall Of Sleep', 1),
  (8, '1406591211', 'Mysteries And Adventures', 6),
  (9, '1482926318', 'At the Mountains of Madness', 1),
  (10, '1523309598', 'The Shunned House', 1),
  (11, '1548491691', 'The Lurking Fear', 1),
  (12, '1605126101', 'Antony and Cleopatra', 4),
  (13, '186171372x', 'Wild Nights: Selected Poems', 5),
  (14, '1942934300', 'All''s Well That Ends Well', 2),
  (15, '8427210957', 'Sherlock Holmes Sigue En Pie', 6),
  (16, '8475176968', 'Cronica De Plata', 5);

-- Book & Authors
INSERT INTO "public"."book_author"
  ("id", "author_id", "book_id")
VALUES
  (1, 1, 1),
  (2, 1, 2),
  (3, 1, 3),
  (4, 1, 4),
  (5, 1, 5),
  (10, 2, 6),
  (11, 2, 7),
  (12, 2, 8),
  (13, 2, 9),
  (14, 3, 10),
  (15, 3, 11),
  (16, 3, 12),
  (17, 3, 13),
  (18, 4, 14),
  (19, 4, 15),
  (20, 4, 16);

-- Book & Library
INSERT INTO "public"."book_library"
  ("id", "library_id", "book_id")
VALUES
  (1, 1, 1),
  (2, 1, 2),
  (3, 1, 3),
  (4, 1, 4),
  (5, 1, 5),
  (6, 1, 6),
  (7, 1, 7),
  (8, 1, 8),
  (9, 1, 9),
  (10, 1, 10),
  (11, 1, 11),
  (12, 1, 12),
  (13, 1, 13),
  (14, 2, 6),
  (15, 2, 7),
  (16, 2, 8),
  (17, 2, 9),
  (18, 2, 10),
  (19, 2, 11),
  (20, 2, 12),
  (21, 2, 13),
  (22, 2, 14),
  (23, 2, 15),
  (24, 2, 16);