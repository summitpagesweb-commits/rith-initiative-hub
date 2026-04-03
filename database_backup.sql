-- Database backup 2026-04-03 04:42:00 UTC

-- Table: blog_posts
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.blog_posts VALUES ('d4fd09e9-c2be-4d77-a730-4358b7b3461a', 'test', 'content', 'excerpt', NULL, 'armaan', 'category', false, false, NULL, 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0', '2026-01-31 04:20:40.438108+00', '2026-02-11 21:48:30.686109+00');

-- Table: blog_form_fields
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.blog_form_fields VALUES ('a5ccac55-8c28-4aac-ab73-50ab49ea37df', '6e5cdfff-b92e-4329-a23c-584c6adcc07d', 'text', '', NULL, NULL, false, 0, '2026-01-31 04:21:09.063505+00');

-- Table: blog_form_submissions
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.blog_form_submissions VALUES ('9c96ccf3-f09c-4003-b919-8102e4a8a7a7', '6e5cdfff-b92e-4329-a23c-584c6adcc07d', '69b36d37-61fa-4761-af30-cd37665248ca', '{"a5ccac55-8c28-4aac-ab73-50ab49ea37df": "t"}', '2026-02-11 21:48:46.053226+00', '2026-02-11 21:48:46.053226+00');

-- Table: blog_likes
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Table: blog_post_forms
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.blog_post_forms VALUES ('6e5cdfff-b92e-4329-a23c-584c6adcc07d', 'd4fd09e9-c2be-4d77-a730-4358b7b3461a', 'Post Survey', 'form', true, '2026-01-31 04:20:41.236666+00', '2026-02-02 02:40:11.134+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0');

-- Table: email_subscribers
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.email_subscribers VALUES ('6404e578-38ea-4e5c-b0c4-9505a6919662', 'hcps-mittalt@henricostudents.org', '2026-01-19 21:14:04.297158+00', 'header');
INSERT INTO public.email_subscribers VALUES ('8cca260d-20e6-48b3-a4ae-31c0365eb595', 'tanishqmittal139@gmail.com', '2026-01-31 03:46:04.930998+00', 'popup');

-- Table: events
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.events VALUES ('de9babc5-2cb2-43db-8323-cf548ea0481d', 'Oral History Project: Threads & Bridges', NULL, '2026-08-15 16:00:00+00', NULL, NULL, NULL, NULL, NULL, 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1772504804415-pdv0vs.png', NULL, false, 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0', '2026-03-03 02:26:21.162555+00', '2026-03-03 02:26:21.162555+00');
INSERT INTO public.events VALUES ('70cfa3b9-3769-405c-88cf-181719e50324', '2024 Diwali Festival', NULL, '2024-10-26 16:00:00+00', '2024-10-27 16:00:00+00', '12:00 PM - 8:00 PM', 'Lewis Ginter Botanical Gardern', 'Festival', NULL, 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/diwali-poster-2024.png', NULL, false, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:07:03.264487+00', '2026-02-03 05:47:54.707697+00');
INSERT INTO public.events VALUES ('7ca67e89-c20a-4aee-84ac-f692e07f4596', '2025 Diwali Festival', 'Join us for the annual Diwali Music & Arts Festival celebrating the festival of lights with music, dance, art, and community.', '2025-10-18 16:00:00+00', NULL, NULL, 'Virginia Museum of History & Culture', 'Festival', NULL, 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/diwali-poster-2025.jpg', NULL, false, NULL, '2026-02-03 05:46:13.505033+00', '2026-02-03 05:47:54.707697+00');

-- Table: media
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.media VALUES ('07dcce33-404d-4ed1-85d4-c1d1c36fb719', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825614248-g3wxmk.jpeg', NULL, NULL, 4, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:05.356254+00');
INSERT INTO public.media VALUES ('dc38cf87-f5d1-48c2-b6b2-b91c43b56fd0', 'blog_post', '15e9109b-61a1-4c1d-8ac3-ea17aca19260', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1767338226638-ntkxig.jpeg', 'ss', 'asdfasdfasdfadsfasdfasdf', 0, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-02 07:17:15.665415+00');
INSERT INTO public.media VALUES ('e2def9b1-3c2c-46f0-80a9-83cc9be354e9', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825614824-c07bfk.jpeg', NULL, NULL, 5, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:05.563092+00');
INSERT INTO public.media VALUES ('90107a29-e2f2-460f-b4ef-4e12f2f463a6', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825615436-ao5a8c.jpeg', NULL, NULL, 6, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:05.769868+00');
INSERT INTO public.media VALUES ('28d2a10b-0439-418d-bb50-670448828add', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825616503-eqwa9.jpeg', NULL, NULL, 8, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:06.074411+00');
INSERT INTO public.media VALUES ('a5763359-6efc-4eeb-8a86-a1dd3e47db57', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825615990-k1gqic.jpeg', NULL, NULL, 7, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:05.920918+00');
INSERT INTO public.media VALUES ('74f7b962-d2b7-4119-a0b9-feac1cb51e4a', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825617219-qlhr2e.jpeg', NULL, NULL, 9, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:06.276177+00');
INSERT INTO public.media VALUES ('68133a53-c833-47a8-89ae-2728a179b27e', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825617955-lsjej.jpeg', NULL, NULL, 10, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:06.428889+00');
INSERT INTO public.media VALUES ('2a0b5bcd-dc5d-4dec-873a-f33dcd5552f6', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'video', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825618459-7yhib.mov', NULL, NULL, 11, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:06.582556+00');
INSERT INTO public.media VALUES ('692dcaf8-d4f4-4c3a-a9c9-08addb95b53b', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825620437-xstmtg.jpeg', NULL, NULL, 12, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:06.794164+00');
INSERT INTO public.media VALUES ('38be8c2f-b2e5-4355-bfc8-05b668e91190', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825621098-e4et4s.jpeg', NULL, NULL, 13, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:06.988514+00');
INSERT INTO public.media VALUES ('5cca8d19-8726-4ef3-a780-9cfe69942e7a', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825621930-60wvqf.jpeg', NULL, NULL, 14, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:07.147586+00');
INSERT INTO public.media VALUES ('cc456b09-e892-4a63-bd91-af1aac471aef', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825622627-cflqqv.jpeg', NULL, NULL, 15, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:07.311907+00');
INSERT INTO public.media VALUES ('7bc08b8b-458f-4948-9094-b1322bd7d431', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825623262-9m4dfe.jpeg', NULL, NULL, 16, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:07.531491+00');
INSERT INTO public.media VALUES ('48570a69-0d53-4723-8ea7-7df471fc2209', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825624798-r1brz.jpeg', NULL, NULL, 17, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:07.868997+00');
INSERT INTO public.media VALUES ('9302ad4b-256f-47d5-87c3-d059f2b3c829', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825625821-3vmr2.jpeg', NULL, NULL, 18, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:08.117718+00');
INSERT INTO public.media VALUES ('08111ba7-a974-4ab2-b458-b9ac75fa0422', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825627050-dexkrj.jpeg', NULL, NULL, 19, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:08.257218+00');
INSERT INTO public.media VALUES ('6291b6a5-1142-4698-9875-c45127a6924c', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825628077-eqjlzl.jpeg', NULL, NULL, 20, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:08.432641+00');
INSERT INTO public.media VALUES ('a88d36c8-030d-41c1-bc24-dcdad2c5b556', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825629099-fvr983.jpeg', NULL, NULL, 21, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:08.571052+00');
INSERT INTO public.media VALUES ('5cd0f5e7-28f3-4e53-b26c-0308f4439765', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825630941-08woqi.jpeg', NULL, NULL, 22, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:08.731726+00');
INSERT INTO public.media VALUES ('51093ccb-982f-4ef9-aea7-2514c45c313b', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825631453-1kkcvo.jpeg', NULL, NULL, 23, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:08.93837+00');
INSERT INTO public.media VALUES ('c0d751b1-3f05-4a2e-a7ba-7730baad0df2', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825631966-hvqu9.jpeg', NULL, NULL, 24, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:09.153781+00');
INSERT INTO public.media VALUES ('7dfc4fdc-cf1d-44b4-9e9c-ffebb6a20e8b', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825632488-3cs2zb.jpeg', NULL, NULL, 25, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:09.302238+00');
INSERT INTO public.media VALUES ('54163e98-b473-4d22-8d49-3b54c73a21c5', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825632994-knj45c.jpeg', NULL, NULL, 26, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:09.446432+00');
INSERT INTO public.media VALUES ('edec5643-36d4-481d-b505-f8f022de1ba4', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825633705-7uikrz.jpeg', NULL, NULL, 27, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:09.597882+00');
INSERT INTO public.media VALUES ('2b574a2a-5d6d-4db9-a080-0bddd1322589', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825636988-53uddqb.jpeg', NULL, NULL, 28, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:09.734515+00');
INSERT INTO public.media VALUES ('7121101f-1a10-49ae-a905-d2ac80b9006e', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825639321-xdes1h.jpeg', NULL, NULL, 29, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:09.94116+00');
INSERT INTO public.media VALUES ('7af2bb27-50c5-4da3-bdc0-678ad79d8904', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825641065-rmi9ke.jpeg', NULL, NULL, 30, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:10.09971+00');
INSERT INTO public.media VALUES ('b1ecab13-8d0d-4ab2-b02f-01a07c6e9e1a', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825644352-k7ovza.jpeg', NULL, NULL, 31, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:10.244873+00');
INSERT INTO public.media VALUES ('bfa6f85f-f569-4120-a658-716f319eb59d', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825645954-vwt8i8.jpeg', NULL, NULL, 32, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:10.415353+00');
INSERT INTO public.media VALUES ('cfc5d1c1-8e8f-495a-b1e5-9fb9c7136227', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825647186-8pkfwt.jpeg', NULL, NULL, 33, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:10.55316+00');
INSERT INTO public.media VALUES ('2ce85214-741d-48e8-ac42-24d304193df7', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825605568-jfz42s.jpeg', NULL, NULL, 0, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:04.656082+00');
INSERT INTO public.media VALUES ('80cea422-59d2-4444-a355-78c042f0f592', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825613728-sk51ohw.jpeg', NULL, NULL, 3, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:05.124658+00');
INSERT INTO public.media VALUES ('063334d9-f132-446d-ae57-6ae0f0c18cb1', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825650560-72bgi6.jpeg', NULL, NULL, 34, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:10.779777+00');
INSERT INTO public.media VALUES ('1aef70e3-9e97-43cd-bb0e-b5feefbe5164', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825656203-38cpme.jpeg', NULL, NULL, 38, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:11.602332+00');
INSERT INTO public.media VALUES ('23ff78e3-7388-4edf-a9ba-8c67499d37ba', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825659677-a5dnvp.jpeg', NULL, NULL, 42, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:12.33249+00');
INSERT INTO public.media VALUES ('9598fd8b-9c4d-43bf-b49f-eae144e2a0f6', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825667396-zeydx9.jpeg', NULL, NULL, 46, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:13.142964+00');
INSERT INTO public.media VALUES ('8477df08-1a5e-483f-9dc9-65bd020e6f45', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825653673-bbimih.jpeg', NULL, NULL, 35, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:10.937842+00');
INSERT INTO public.media VALUES ('ce0c353a-5c00-4fe1-99c0-4b43f501a353', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825657060-eom0c.jpeg', NULL, NULL, 39, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:11.813894+00');
INSERT INTO public.media VALUES ('226bb8ea-39f2-43b4-83ad-141d1d9356cb', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825660402-sxgbg.jpeg', NULL, NULL, 43, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:12.632335+00');
INSERT INTO public.media VALUES ('259d23c6-2f2f-41b6-864a-336cbe4d8e04', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825654599-j323e.jpeg', NULL, NULL, 36, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:11.174853+00');
INSERT INTO public.media VALUES ('06f70f58-bed1-4ce9-938e-a358ef59908e', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825662479-9qfwv.jpeg', NULL, NULL, 44, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:12.783344+00');
INSERT INTO public.media VALUES ('adb57d8b-4a4f-46c1-8641-c02925314a43', 'blog_post', 'd4fd09e9-c2be-4d77-a730-4358b7b3461a', 'image', 'https://storage.googleapis.com/gpt-engineer-file-uploads/8ACX8saPDiVeND1sNeM35FPDAhd2/93c294f9-ea42-4c36-b935-3a5331e5208b?Expires=1769836295&GoogleAccessId=go-api-on-aws%40gpt-engineer-390607.iam.gserviceaccount.com&Signature=mjkPRQW93PPE%2FWa2n7hwkJc1XwcBK1jbOf%2B0afkHk5JYPIUZM4RFXbzN52f0hT8tjnj6xJ9eKBXzudX%2B3lCubNI5uEN%2Fdmo2rSEN2%2F5RV9DXHXESc3lqFpdp0ZH0hi9zFvakZG3TjcGf94XW3T0BpqpEFUMWuNEIIR9zHW%2FldBTY4ybOMYjp8tUyvCcRvBYu5a5EhFj0%2FlCRIvSqREChSoWU%2Fussf%2BgTiRt4NDwKC9fJu8T734fmi3ts6x2xunX7aofOBr7MlL2xYME5Y0v9X8kvA%2FL6TSxpLnenLXR6xkAA1RGN8qvZRvHNUXN0cvtPTTo2o051biOCrSJEcO6hOQ%3D%3D', NULL, 'description', 0, 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0', '2026-01-31 04:20:40.868367+00');
INSERT INTO public.media VALUES ('038271f7-1d9f-4978-8acc-67cd033b29aa', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825655329-4hsvrj.jpeg', NULL, NULL, 37, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:11.451778+00');
INSERT INTO public.media VALUES ('dd6e93ca-0ae3-4c57-b1e6-fd38b711edfb', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825658998-k8a9ju.jpeg', NULL, NULL, 41, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:12.156345+00');
INSERT INTO public.media VALUES ('aeccb9e6-aa42-4dbc-8339-3186d10fc307', 'event', '70cfa3b9-3769-405c-88cf-181719e50324', 'image', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1769825664735-z4toa5.jpeg', NULL, NULL, 45, 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', '2026-01-31 02:15:12.93761+00');
INSERT INTO public.media VALUES ('6621baef-52a2-463e-9b32-2b6fac7aea60', 'blog_post', '03143ba7-d36a-4f73-9e33-3fea3d8a2ef0', 'image', 'https://storage.googleapis.com/gpt-engineer-file-uploads/8ACX8saPDiVeND1sNeM35FPDAhd2/96f9f300-bbac-483d-a018-04a704390111?Expires=1769833937&GoogleAccessId=go-api-on-aws%40gpt-engineer-390607.iam.gserviceaccount.com&Signature=n8HUxa%2Fl8usMzcGz5rbZaOuPD0LcHjaSannbKD0jGEoocFdGYYLIYZQNfe2SXBdFdXVyk0EnN%2BRPCbqzWoSuyGOnvVDDpyAsXyw2FMmO7b%2BF%2F3OCw5b6hH71ZPwlU17SGNhmbcBCphQkvliO9Bf%2BbR7FUXdbA4254qAG9Y2HRqvvDafVN2FdmsruUjkuHFoQT5boHeacvsl0BP8zCslRmgy1WWYymFjLh1nAANanY5qcoH%2FDzksdP9lTlFbyN7ENvqcFPs0ZxS9Xv9vus9ls8sDyT2T6fsgr2ykMltJDaiKLpIhHaG74csT8fUSDa8mC243InxDzFD5DDNrJiQNxoA%3D%3D', 'Test image', 'test', 0, 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0', '2026-01-31 04:02:54.900044+00');

-- Table: profiles
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.profiles VALUES ('c5ef9630-b34c-4c36-a683-7435f58f9911', '43a38471-3d3c-45ed-919d-d73cfd23c142', 'summitpages.web@gmail.com', 'SummitPages', '2026-01-01 22:53:12.597943+00', '2026-01-01 22:53:12.597943+00');
INSERT INTO public.profiles VALUES ('c01e1fa2-f0ea-4173-a8bc-73e84017df46', 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', 'tanishqmittal139@gmail.com', 'Tanishq Mittal', '2026-01-01 22:54:05.260927+00', '2026-01-01 22:54:05.260927+00');
INSERT INTO public.profiles VALUES ('9980567c-56bf-436c-af3f-cac6d9b7fea5', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0', 'hcps-guptaa5@henricostudents.org', 'Armaan Gupta', '2026-01-31 03:41:20.453538+00', '2026-01-31 03:41:20.453538+00');

-- Table: shop_items
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.shop_items VALUES ('e5c330d4-b8b3-435c-9eae-2d404d4160f3', 'Test Item', 'Description of test item.', 34.99, 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/shop/1771895227055-2uqryc.jpeg', 'https://therithinitiative.vercel.app', 'Clothing', true, false, 0, NULL, '2026-02-24 01:06:36.5874+00', '2026-02-24 01:06:36.5874+00');

-- Table: site_content
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.site_content VALUES ('fd106427-b19a-47ca-9e5e-71d814857a4d', 'home_gallery', 'Moments From Our Events', NULL, 'gallery', NULL, true, '2026-01-31 03:05:44.15443+00', '2026-01-31 03:05:44.15443+00', NULL);
INSERT INTO public.site_content VALUES ('2e7198e6-34e6-4cb8-8f6c-0b59ff54e256', 'event_highlights', 'Event Highlights', NULL, 'video', 'https://www.youtube.com/watch?v=iYS5kNCFDsc', true, '2026-01-31 03:05:44.15443+00', '2026-01-31 04:42:12.053989+00', NULL);

-- Table: site_gallery
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.site_gallery VALUES ('209f6dbd-5d9f-44a0-b22c-6ee0b8cb9a33', 'home_gallery', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/gallery/1770003269613-nv5dcnr.jpg', NULL, NULL, 2, '2026-02-02 03:33:58.867757+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0');
INSERT INTO public.site_gallery VALUES ('450d73b1-13b5-4f55-982e-9f0ce41b8147', 'home_gallery', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/gallery/1770003270598-4s627v.jpg', NULL, NULL, 3, '2026-02-02 03:34:00.382408+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0');
INSERT INTO public.site_gallery VALUES ('c4e66271-7c99-463b-b752-e83ca435d689', 'home_gallery', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/gallery/1770003899150-tlig76.jpeg', NULL, NULL, 4, '2026-02-02 03:44:28.380922+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0');
INSERT INTO public.site_gallery VALUES ('fc8c861f-44ab-4c74-ae8d-7867ef483933', 'home_gallery', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/gallery/1770003900112-a97l7.jpeg', NULL, NULL, 5, '2026-02-02 03:44:29.061653+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0');
INSERT INTO public.site_gallery VALUES ('ce167b94-7906-461c-964d-fbae5f803d86', 'home_gallery', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/gallery/1770003900797-exkq9k.jpeg', NULL, NULL, 6, '2026-02-02 03:44:29.729738+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0');
INSERT INTO public.site_gallery VALUES ('0ffa374e-7f3e-4f59-b9cf-1c34b9c2dd91', 'home_gallery', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/gallery/1770003901452-k3324u.jpeg', NULL, NULL, 7, '2026-02-02 03:44:30.503244+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0');
INSERT INTO public.site_gallery VALUES ('748f4f23-675f-4a9e-97c4-8774f6fd0532', 'home_gallery', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/gallery/1770003267186-h1juk9.jpg', NULL, NULL, 0, '2026-02-02 03:33:56.98459+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0');
INSERT INTO public.site_gallery VALUES ('6771fb19-d3cf-4add-bc80-9b77fd0243e7', 'home_gallery', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/gallery/1770003268745-itckw.jpg', NULL, NULL, 1, '2026-02-02 03:33:57.891868+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0');

-- Table: updates
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.updates VALUES ('81cf8791-8d8e-4244-b8d9-de76cb59ae38', 'The Rith Initiative Featured on Richmond Magazine', NULL, 'https://rvamag.com/music/festivals/richmond-meets-india-diwali-festival-brings-a-burst-of-color-and-culture.html', 'link', true, false, '2026-02-02 03:37:18.008+00', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0', '2026-02-02 03:26:31.597154+00', '2026-02-02 03:36:46.516385+00', 'https://axuewywsopgztjmgbtci.supabase.co/storage/v1/object/public/images/uploads/1770003429579-z0el59.jpg');

-- Table: user_roles
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO public.user_roles VALUES ('2ea6a782-d9b5-470b-8273-1498e030418b', '43a38471-3d3c-45ed-919d-d73cfd23c142', 'admin', '2026-01-01 22:53:12.597943+00');
INSERT INTO public.user_roles VALUES ('91896ec4-f440-4913-af17-0909994c7401', 'f11df9ab-4605-4fbe-a57b-b5c417e7feee', 'admin', '2026-01-01 22:54:32.909947+00');
INSERT INTO public.user_roles VALUES ('c764a890-9230-4389-a4cf-4c66fc41782f', 'f4d6de2e-7735-4bc9-8bf6-a73362d544f0', 'admin', '2026-01-31 03:51:08.964509+00');

