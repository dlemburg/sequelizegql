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
  (2, '47305', 'Indiana');

-- Libraries
INSERT INTO "public"."library"
  ("id", "city_id", "name", "address", "description", "status")
VALUES
  (1, 1, 'Richter Library', '1300 Memorial Dr, Coral Gables,', 'Principal library', 'ACTIVE'),
  (2, 2, 'Carnegie Library', '301 EAST JACKSON STREET', 'Carnegie princial', 'ACTIVE');

-- Books
INSERT INTO "public"."book"
  ("isbn", "title", "category_id")
VALUES
  ('0140623612', 'The Hound of the Baskervilles', 6),
  ('0143427156', 'Merchant Of Venice', 4),
  ('014342730x', 'Macbeth', 3),
  ('0606043918', 'I''m Nobody! Who Are You?', 5),
  ('0821216481', 'Acts Of Light', 5),
  ('084419512x', 'Tales Of The Cthulhu Mythos Volume 2', 1),
  ('1121427634', 'Beyond The Wall Of Sleep', 1),
  ('1406591211', 'Mysteries And Adventures', 6),
  ('1482926318', 'At the Mountains of Madness', 1),
  ('1523309598', 'The Shunned House', 1),
  ('1548491691', 'The Lurking Fear', 1),
  ('1605126101', 'Antony and Cleopatra', 4),
  ('186171372x', 'Wild Nights: Selected Poems', 5),
  ('1942934300', 'All''s Well That Ends Well', 2),
  ('8427210957', 'Sherlock Holmes Sigue En Pie', 6),
  ('8475176968', 'Cronica De Plata', 5);

-- Book & Authors
INSERT INTO "public"."book_author"
  ("id", "author_id", "book_isbn")
VALUES
  (1, 1, '084419512x'),
  (2, 1, '1121427634'),
  (3, 1, '1482926318'),
  (4, 1, '1523309598'),
  (5, 1, '1548491691'),
  (10, 2, '1942934300'),
  (11, 2, '014342730x'),
  (12, 2, '0143427156'),
  (13, 2, '1605126101'),
  (14, 3, '0821216481'),
  (15, 3, '186171372x'),
  (16, 3, '8475176968'),
  (17, 3, '0606043918'),
  (18, 4, '0140623612'),
  (19, 4, '8427210957'),
  (20, 4, '1406591211');

-- Book & Library
INSERT INTO "public"."book_library"
  ("id", "library_id", "book_isbn")
VALUES
  (1, 1, '084419512x'),
  (2, 1, '1121427634'),
  (3, 1, '1482926318'),
  (4, 1, '1523309598'),
  (5, 1, '1548491691'),
  (6, 1, '1942934300'),
  (7, 1, '014342730x'),
  (8, 1, '0143427156'),
  (9, 1, '1605126101'),
  (10, 1, '0821216481'),
  (11, 1, '186171372x'),
  (12, 1, '8475176968'),
  (13, 1, '0606043918'),
  (14, 2, '1942934300'),
  (15, 2, '014342730x'),
  (16, 2, '0143427156'),
  (17, 2, '1605126101'),
  (18, 2, '0821216481'),
  (19, 2, '186171372x'),
  (20, 2, '8475176968'),
  (21, 2, '0606043918'),
  (22, 2, '0140623612'),
  (23, 2, '8427210957'),
  (24, 2, '1406591211');