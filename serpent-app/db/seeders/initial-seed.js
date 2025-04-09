import { create_connection } from '../utils/connection';
const { v4: uuidv4 } = require('uuid');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();



async function seedDatabase() {
    const connection = await create_connection();

    try {
        console.log('\nseeding users...');
        await connection.query(`
            INSERT INTO users (user_id, email, first_name, last_name, username, password, github_username, leetcode_username, created_at)
            VALUES ('${proccess.env.USER_ID}', 'abeabebrege@gmail.com', 'Abe', 'Brege', 'imabe', '$argon2id$v=19$m=65536,t=3,p=4$2qwLF/YTnjP/ktjuVPFIEA$hDNg+X+OhFc3R3t8HFHpVukTrLfCj/DfqwCbTDj6M44', 'abrege11', 'abrege11', NOW());
        `);

        console.log('seeding sessions...');
        await connection.query(`
            INSERT INTO sessions (session_id, user_id, start, end, created_at) VALUES
            ('51a9649c-de75-42e1-9daa-02ce53a2bbd4', '${proccess.env.USER_ID}', '2025-02-01 12:00:00', '2025-02-01 12:00:00', NOW()),
            ('5ec02c29-1b9b-4f19-a2e2-327652fd0e45', '${proccess.env.USER_ID}', '2024-12-13 15:00:00', '2024-12-13 22:34:00', NOW()),
            ('3aafdac1-863d-404e-9f29-d102faa6786b', '${proccess.env.USER_ID}', '2024-12-15 14:14:00', '2024-12-13 22:45:00', NOW()),
            ('515b042b-14e4-4468-8ee4-c1aecb382183', '${proccess.env.USER_ID}', '2024-12-16 15:00:00', '2024-12-17 01:45:00', NOW()),
            ('310a8148-1372-4262-8230-1101925b0402', '${proccess.env.USER_ID}', '2024-12-18 12:09:00', '2024-12-18 20:34:00', NOW()),
            ('7e68fc10-d627-4dd1-b6b6-d6260cccdf7f', '${proccess.env.USER_ID}', '2024-12-19 19:27:00', '2024-12-19 22:12:00', NOW()),
            ('e7e193d4-244d-475a-9bff-4bda036d6711', '${proccess.env.USER_ID}', '2024-12-20 15:38:00', '2024-12-20 18:45:00', NOW()),
            ('e4ab7862-eea0-4cd3-8a7e-6c684faeb3bb', '${proccess.env.USER_ID}', '2024-12-21 12:38:00', '2024-12-21 22:30:00', NOW()),
            ('92b52a19-0a21-43dc-8b5a-ebacdded943d', '${proccess.env.USER_ID}', '2024-12-22 11:15:00', '2024-12-22 17:18:00', NOW()),
            ('c5534bfd-9d52-4314-b3da-9accedebd11f', '${proccess.env.USER_ID}', '2024-12-23 12:05:00', '2024-12-23 14:44:00', NOW()),
            ('48f21b58-1176-4fdd-ae73-89ebb8b74c7c', '${proccess.env.USER_ID}', '2024-12-25 10:36:00', '2024-12-25 21:17:00', NOW()),
            ('e36b16c3-8061-4779-9e4c-9b09b61b3696', '${proccess.env.USER_ID}', '2024-12-26 19:43:00', '2024-12-26 23:10:00', NOW()),
            ('4332ebd7-737f-49d9-9e54-8aae460eb112', '${proccess.env.USER_ID}', '2024-12-27 13:40:00', '2024-12-27 22:00:00', NOW()),
            ('fffdade5-a1e9-4d19-88c2-41a584854e02', '${proccess.env.USER_ID}', '2024-12-28 11:31:00', '2024-12-28 17:15:00', NOW()),
            ('365cc9b5-293d-4026-82fa-3c3973eb53ad', '${proccess.env.USER_ID}', '2024-12-29 12:46:00', '2024-12-29 20:06:00', NOW()),
            ('f54a3046-959e-49e6-8aac-f1d77efd113e', '${proccess.env.USER_ID}', '2025-01-01 14:05:00', '2025-01-01 17:29:00', NOW()),
            ('4a6ea801-ed1a-40e8-bbc1-6200383cbdea', '${proccess.env.USER_ID}', '2025-01-03 12:10:00', '2025-01-03 20:30:00', NOW()),
            ('aee87bbe-42e5-4d55-9f4f-9ef5a5d01687', '${proccess.env.USER_ID}', '2025-01-05 12:00:00', '2025-01-05 17:59:00', NOW()),
            ('fa26b780-7e22-4624-a625-01238702753e', '${proccess.env.USER_ID}', '2025-01-06 11:00:00', '2025-01-07 00:30:00', NOW()),
            ('fe00d621-2a05-498f-84ff-3ced17873a5c', '${proccess.env.USER_ID}', '2025-01-07 14:34:00', '2025-01-08 00:40:00', NOW()),
            ('98dff8c9-91a4-468a-b2dc-a30a449c2ce1', '${proccess.env.USER_ID}', '2025-01-08 13:00:00', '2025-01-08 19:02:00', NOW()),
            ('d2e51777-1830-4757-ab81-5d9918f2faa3', '${proccess.env.USER_ID}', '2025-01-09 13:14:00', '2025-01-09 17:31:00', NOW()),
            ('a24d3768-cd61-4d97-bd91-8129aeec57e9', '${proccess.env.USER_ID}', '2025-01-10 15:17:00', '2025-01-10 23:40:00', NOW()),
            ('255ccf52-c56b-420f-82e4-ecebf273378a', '${proccess.env.USER_ID}', '2025-01-11 11:00:00', '2025-01-11 20:00:00', NOW()),
            ('6ee0a490-bd17-46f5-bdb0-95cae6229b8d', '${proccess.env.USER_ID}', '2025-01-13 09:56:00', '2025-01-13 12:38:00', NOW()),
            ('16bb9b4b-e609-460e-8656-8806bb94fe10', '${proccess.env.USER_ID}', '2025-01-14 12:00:00', '2025-01-14 21:00:00', NOW()),
            ('af026c2a-e6cb-4eb1-927d-6f8e3c91f783', '${proccess.env.USER_ID}', '2025-01-17 15:05:00', '2025-01-18 00:02:00', NOW()),
            ('61be7d1b-5ac1-4fdb-91bb-527a41d9fe14', '${proccess.env.USER_ID}', '2025-01-18 12:34:00', '2025-01-18 19:30:00', NOW()),
            ('85b696b9-4162-4eb1-b7d6-939003eb33a4', '${proccess.env.USER_ID}', '2025-01-19 12:55:00', '2025-01-19 15:55:00', NOW()),
            ('c334ca4c-95b0-4c14-a44a-ea1d07644f37', '${proccess.env.USER_ID}', '2025-01-20 13:00:00', '2025-01-20 20:03:00', NOW()),
            ('8cfaa40f-ffb1-402d-9db7-13fe704c4747', '${proccess.env.USER_ID}', '2025-01-21 11:00:00', '2025-01-21 19:25:00', NOW()),
            ('ef286a91-f11c-4557-8a20-24cd9814ce93', '${proccess.env.USER_ID}', '2025-01-22 09:58:00', '2025-01-22 17:50:00', NOW());
        `);

        console.log('seeding intervals...');
        await connection.query(`
            INSERT INTO intervals (interval_id, session_id, start, end, created_at) VALUES
            ('d8d7329e-fefe-4d3c-bd96-b878bdd5b5fd', '51a9649c-de75-42e1-9daa-02ce53a2bbd4', '2025-02-01 12:00:00', '2025-02-01 12:00:00', NOW()),
            ('ffd4ca53-0324-4276-beb9-0909c022779f', '5ec02c29-1b9b-4f19-a2e2-327652fd0e45', '2024-12-13 15:00:00', '2024-12-13 18:24:00', NOW()),
            ('9f0ff3f5-1c00-4631-8315-173536fe1a2f', '5ec02c29-1b9b-4f19-a2e2-327652fd0e45', '2024-12-13 20:23:00', '2024-12-13 22:34:00', NOW()),
            ('d1925a3f-4a35-4156-8a00-e9f3fadc7ad8', '3aafdac1-863d-404e-9f29-d102faa6786b', '2024-12-15 14:14:00', '2024-12-15 22:45:00', NOW()),
            ('1cffd642-33a8-4bf2-84b4-d569699e1334', '515b042b-14e4-4468-8ee4-c1aecb382183', '2024-12-16 15:00:00', '2024-12-16 18:02:00', NOW()),
            ('086ebf77-d9fd-4f7c-aaa9-fc09e318c607', '515b042b-14e4-4468-8ee4-c1aecb382183', '2024-12-16 19:39:00', '2024-12-16 20:45:00', NOW()),
            ('6650b285-0a35-49e7-9121-12ef8744df37', '515b042b-14e4-4468-8ee4-c1aecb382183', '2024-12-17 00:09:00', '2024-12-17 01:45:00', NOW()),
            ('3179aa81-693a-4c82-a64c-6ce5902bde9b', '310a8148-1372-4262-8230-1101925b0402', '2024-12-18 12:09:00', '2024-12-18 20:34:00', NOW()),
            ('660160e5-762f-472a-94ed-39ce0ada3900', '7e68fc10-d627-4dd1-b6b6-d6260cccdf7f', '2024-12-19 19:27:00', '2024-12-19 22:12:00', NOW()),
            ('84de5818-8918-4131-bcc1-d88d13839f05', 'e7e193d4-244d-475a-9bff-4bda036d6711', '2024-12-20 15:38:00', '2024-12-20 18:45:00', NOW()),
            ('ed8bfc92-506d-4fd8-b083-641f11ee3fa2', 'e4ab7862-eea0-4cd3-8a7e-6c684faeb3bb', '2024-12-21 12:38:00', '2024-12-21 16:30:00', NOW()),
            ('3b38ff40-1da9-48ab-a6e0-5e1e44953db8', 'e4ab7862-eea0-4cd3-8a7e-6c684faeb3bb', '2024-12-21 14:00:00', '2024-12-21 22:30:00', NOW()),
            ('7cef62fa-1e81-45e7-80ac-8d65dcd596dd', '92b52a19-0a21-43dc-8b5a-ebacdded943d', '2024-12-22 11:15:00', '2024-12-22 17:18:00', NOW()),
            ('fb4e2c01-0fe0-42e6-a089-a147d22d84d8', '92b52a19-0a21-43dc-8b5a-ebacdded943d', '2024-12-23 12:05:00', '2024-12-23 14:44:00', NOW()),
            ('c69f4188-eea4-4e44-b1c4-6b37a2e3c676', '92b52a19-0a21-43dc-8b5a-ebacdded943d', '2024-12-25 10:36:00', '2024-12-25 12:54:00', NOW()),
            ('07d8bc4e-6168-478d-9bdc-b37542eadab2', '92b52a19-0a21-43dc-8b5a-ebacdded943d', '2024-12-25 16:39:00', '2024-12-25 21:17:00', NOW()),
            ('01b096f8-5df4-4be6-928d-e0ad005c4475', 'e36b16c3-8061-4779-9e4c-9b09b61b3696', '2024-12-26 19:43:00', '2024-12-26 23:10:00', NOW()),
            ('5d229679-947e-4e8f-b9d1-7ebfb90baa81', '4332ebd7-737f-49d9-9e54-8aae460eb112', '2024-12-27 13:40:00', '2024-12-27 15:59:00', NOW()),
            ('37b38c17-741e-4e36-b665-bb957b0fbded', '4332ebd7-737f-49d9-9e54-8aae460eb112', '2024-12-27 16:45:00', '2024-12-27 18:03:00', NOW()),
            ('09df53aa-b053-4372-bfd4-b8e51507a9ea', '4332ebd7-737f-49d9-9e54-8aae460eb112', '2024-12-27 19:04:00', '2024-12-27 22:00:00', NOW()),
            ('2dd31a03-9c16-49fc-84b7-1c562b982a38', 'fffdade5-a1e9-4d19-88c2-41a584854e02', '2024-12-28 11:31:00', '2024-12-28 15:31:00', NOW()),
            ('bce6409c-32fc-40d2-84fd-159b6f8dba0e', 'fffdade5-a1e9-4d19-88c2-41a584854e02', '2024-12-28 16:02:00', '2024-12-28 17:15:00', NOW()),
            ('6a1df6d1-5010-4aea-9cee-ee62f662764d', '365cc9b5-293d-4026-82fa-3c3973eb53ad', '2024-12-29 12:46:00', '2024-12-29 20:06:00', NOW()),
            ('6d546634-9a02-4f32-8aae-b9ac84daf8d2', 'f54a3046-959e-49e6-8aac-f1d77efd113e', '2025-01-01 14:05:00', '2025-01-01 16:32:00', NOW()),
            ('6d7f8d39-1229-4d39-8dc5-4eeed94a76ab', 'f54a3046-959e-49e6-8aac-f1d77efd113e', '2025-01-01 16:32:00', '2025-01-01 17:29:00', NOW()),
            ('cc0683d5-b776-4ff9-9a09-4a6fdceda6ac', '4a6ea801-ed1a-40e8-bbc1-6200383cbdea', '2025-01-03 12:10:00', '2025-01-03 15:36:00', NOW()),
            ('c1a56db1-5bbc-4753-95b2-5a7aaf00777e', '4a6ea801-ed1a-40e8-bbc1-6200383cbdea', '2025-01-03 17:00:00', '2025-01-03 20:30:00', NOW()),
            ('4eb73c09-4497-438e-a7e0-2ef7c51af7a8', 'aee87bbe-42e5-4d55-9f4f-9ef5a5d01687', '2025-01-05 12:00:00', '2025-01-05 17:59:00', NOW()),
            ('492513f9-85a0-4c75-8a8d-5db01fc2704b', 'fa26b780-7e22-4624-a625-01238702753e', '2025-01-06 11:00:00', '2025-01-06 18:00:00', NOW()),
            ('641c72f8-6f19-442b-a955-1aa699775411', 'fa26b780-7e22-4624-a625-01238702753e', '2025-01-06 19:16:00', '2025-01-07 00:30:00', NOW()),
            ('e7faa4c5-ba70-42db-a1c2-a2ba7bb87769', 'fe00d621-2a05-498f-84ff-3ced17873a5c', '2025-01-07 14:34:00', '2025-01-07 17:48:00', NOW()),
            ('82db9f81-c3dd-42e5-b911-a239553b77ce', 'fe00d621-2a05-498f-84ff-3ced17873a5c', '2025-01-07 20:20:00', '2025-01-08 00:40:00', NOW()),
            ('424a9f56-7590-4ee9-a2ff-1540cbf7827c', '98dff8c9-91a4-468a-b2dc-a30a449c2ce1', '2025-01-08 13:00:00', '2025-01-08 19:02:00', NOW()),
            ('a34ae5aa-c8e9-4184-86ed-54f3e4f8dff8', 'd2e51777-1830-4757-ab81-5d9918f2faa3', '2025-01-09 13:14:00', '2025-01-09 17:31:00', NOW()),
            ('ef7c0d0e-1a70-4f38-8ea6-2679aed1f0fb', 'a24d3768-cd61-4d97-bd91-8129aeec57e9', '2025-01-10 15:17:00', '2025-01-10 23:40:00', NOW()),
            ('50646cba-27e1-4013-81fb-fb546c47a3fb', '255ccf52-c56b-420f-82e4-ecebf273378a', '2025-01-11 11:00:00', '2025-01-11 20:00:00', NOW()),
            ('f1fce5e1-63c1-4f13-a3e9-a4e1a70a2100', '6ee0a490-bd17-46f5-bdb0-95cae6229b8d', '2025-01-13 09:56:00', '2025-01-13 10:48:00', NOW()),
            ('801cc813-ca31-4fe6-b0ec-28ec99274b7f', '6ee0a490-bd17-46f5-bdb0-95cae6229b8d', '2025-01-13 10:20:00', '2025-01-13 12:38:00', NOW()),
            ('f5ea825c-dae2-44fa-bbd0-caacc7e88a2d', '16bb9b4b-e609-460e-8656-8806bb94fe10', '2025-01-14 12:00:00', '2025-01-14 15:45:00', NOW()),
            ('4bd55f24-ed69-4a36-a09c-d379c6f0d820', '16bb9b4b-e609-460e-8656-8806bb94fe10', '2025-01-14 16:30:00', '2025-01-14 17:10:00', NOW()),
            ('a03fb2a7-484f-416e-bfd2-758c47461463', '16bb9b4b-e609-460e-8656-8806bb94fe10', '2025-01-14 17:15:00', '2025-01-14 18:36:00', NOW()),
            ('c00eda8d-98f2-4fe8-b067-c59ed7c1d755', '16bb9b4b-e609-460e-8656-8806bb94fe10', '2025-01-14 19:02:00', '2025-01-14 21:00:00', NOW()),
            ('99980a54-1a66-45d4-a427-2972aaa0df99', 'af026c2a-e6cb-4eb1-927d-6f8e3c91f783', '2025-01-17 15:05:00', '2025-01-18 17:52:00', NOW()),
            ('6cd2a849-eb17-4945-909f-e633e2bae497', 'af026c2a-e6cb-4eb1-927d-6f8e3c91f783', '2025-01-17 19:45:00', '2025-01-18 00:02:00', NOW()),
            ('a3d954e7-f9a6-4f77-b269-2c412b0f8d05', '61be7d1b-5ac1-4fdb-91bb-527a41d9fe14', '2025-01-18 12:50:00', '2025-01-18 18:08:00', NOW()),
            ('5ce4ecda-7f9d-4754-9cef-6559740e37c3', '61be7d1b-5ac1-4fdb-91bb-527a41d9fe14', '2025-01-18 12:34:00', '2025-01-18 14:02:00', NOW()),
            ('77b88354-e178-4973-8fc8-60372375ab8b', '61be7d1b-5ac1-4fdb-91bb-527a41d9fe14', '2025-01-18 14:03:00', '2025-01-18 15:30:00', NOW()),
            ('37232e9f-0101-4965-bf67-d9f8fdcbd28d', '61be7d1b-5ac1-4fdb-91bb-527a41d9fe14', '2025-01-18 18:55:00', '2025-01-18 19:30:00', NOW()),
            ('9d22e292-0900-42b9-aad8-895e683b17c8', '85b696b9-4162-4eb1-b7d6-939003eb33a4', '2025-01-19 12:55:00', '2025-01-19 15:55:00', NOW()),
            ('5f180dac-fb13-401d-b685-e37a238ee16a', 'c334ca4c-95b0-4c14-a44a-ea1d07644f37', '2025-01-20 13:00:00', '2025-01-20 14:29:00', NOW()),
            ('58519702-e878-4b2e-9797-f18a351aaf3a', 'c334ca4c-95b0-4c14-a44a-ea1d07644f37', '2025-01-20 14:32:00', '2025-01-20 16:15:00', NOW()),
            ('7b160a0b-dafa-4893-8218-524e2a77df5a', 'c334ca4c-95b0-4c14-a44a-ea1d07644f37', '2025-01-20 16:16:00', '2025-01-20 20:03:00', NOW()),
            ('6bddfaa2-bab6-4c8f-8788-973422e65a23', '8cfaa40f-ffb1-402d-9db7-13fe704c4747', '2025-01-21 11:00:00', '2025-01-21 15:31:00', NOW()),
            ('fefe75d1-e3ce-4c91-ac4d-cf5def688403', '8cfaa40f-ffb1-402d-9db7-13fe704c4747', '2025-01-21 15:40:00', '2025-01-21 16:59:00', NOW()),
            ('a4d63706-70d8-41ad-b746-429b3a5568bd', '8cfaa40f-ffb1-402d-9db7-13fe704c4747', '2025-01-21 17:00:00', '2025-01-21 19:25:00', NOW()),
            ('4170dfb7-f39d-41db-adef-97e59ac6ee79', 'ef286a91-f11c-4557-8a20-24cd9814ce93', '2025-01-22 09:58:00', '2025-01-22 11:43:00', NOW()),
            ('1adf856c-c24e-43fa-bfb9-f95812e44950', 'ef286a91-f11c-4557-8a20-24cd9814ce93', '2025-01-22 12:02:00', '2025-01-22 15:50:00', NOW()),
            ('2c93905f-5e0e-4cb6-a08a-2d9247cde37f', 'ef286a91-f11c-4557-8a20-24cd9814ce93', '2025-01-22 16:00:00', '2025-01-22 17:50:00', NOW());
        `);

        console.log('seeding activities...');
        await connection.query(`
            INSERT INTO other_activities (activity_id, name, type, description, public, upvotes, language, created_at) VALUES
            ('88aa0942-f8cd-4c57-b454-5f52ddf6a3f1', 'ma265', 'Homework', 'Northern Michigan University Calculus 3', true, 0, '', NOW()),
            ('897eb526-fc5b-4aca-a92f-0324d34353fc', 'Syncurrent', 'Work', 'Writing scrapers at Syncurrent', true, 0, 'Python', NOW()),
            ('aa2866f8-a7bc-4711-b66d-d44cdf832876', 'cs222', 'Homework', 'Northern Michigan University Data Structures', true, 0, 'C++', NOW()),
            ('ab0c7845-51f8-4092-a297-ad2d3555e163', 'cs422', 'Homework', 'Northern Michigan University Advanced Algorithms', true, 0, 'Java', NOW()),
            ('81de4134-d3cb-4e59-8ef4-e49913358610', 'Serpent', 'Senior Project', 'The best fucking tracking app ever made', true, 0, 'JavaScript', NOW());
        `);

        console.log('seeding interval activities...');
        await connection.query(`
            INSERT INTO interval_activity (interval_activity_id, interval_id, commit_id, solution_id, activity_id, submission_id, created_at) VALUES
            ('f43de7ac-10f2-44fd-84ff-09ab180a6f36', 'd8d7329e-fefe-4d3c-bd96-b878bdd5b5fd', NULL, NULL, NULL, NULL, NOW()),
            ('1cfdd7bc-0dff-4c74-b171-98664b884fa6', 'ffd4ca53-0324-4276-beb9-0909c022779f', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('faa2cec6-c5fc-480a-b593-09895bc4b915', '9f0ff3f5-1c00-4631-8315-173536fe1a2f', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('80492744-7af6-4e88-ad41-1fa235fc83d4', 'd1925a3f-4a35-4156-8a00-e9f3fadc7ad8', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('6c65b75f-9d2a-4184-bb38-1e7124e1423d', '1cffd642-33a8-4bf2-84b4-d569699e1334', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('120fc3bb-6839-4867-a4e7-86aa34b5b83f', '086ebf77-d9fd-4f7c-aaa9-fc09e318c607', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('74cef469-7321-4fd5-bac2-b83230c78399', '6650b285-0a35-49e7-9121-12ef8744df37', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('975ee0ff-a5f4-40d5-ad62-a1162db686b8', '3179aa81-693a-4c82-a64c-6ce5902bde9b', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('8700e347-df8e-4a58-92c4-0b96c7da8a54', '660160e5-762f-472a-94ed-39ce0ada3900', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('83d17afa-5fb5-45d1-83c6-3cbac2646bc9', '84de5818-8918-4131-bcc1-d88d13839f05', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('bb9492dc-f69c-466f-a360-4b8d7566ae54', 'ed8bfc92-506d-4fd8-b083-641f11ee3fa2', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('5c038a20-7e8a-498d-a34e-dd7710482e5a', '3b38ff40-1da9-48ab-a6e0-5e1e44953db8', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('9bf9789a-ff3c-4e89-8148-a7d58491e1b7', '7cef62fa-1e81-45e7-80ac-8d65dcd596dd', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('6686a759-44e6-4f37-ae51-fb7a8340686c', 'fb4e2c01-0fe0-42e6-a089-a147d22d84d8', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('449c2f9a-528c-41be-b1ab-19632ef601d7', 'c69f4188-eea4-4e44-b1c4-6b37a2e3c676', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('dbf05d37-ef0b-4b40-8419-bedcb72627d4', '07d8bc4e-6168-478d-9bdc-b37542eadab2', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('174df3f3-ce06-40a7-8526-342bf0a7a4d6', '01b096f8-5df4-4be6-928d-e0ad005c4475', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('4b778e3c-b46d-4d74-b87b-79340a5e42ea', '5d229679-947e-4e8f-b9d1-7ebfb90baa81', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('89ddcbcf-b29f-4c9b-855d-c3eb80db7f2e', '37b38c17-741e-4e36-b665-bb957b0fbded', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('a7b994fa-797f-496c-a58d-e4a67eea2d51', '09df53aa-b053-4372-bfd4-b8e51507a9ea', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('99dff9f3-c64b-44b3-8abd-96c4eb7161d1', '2dd31a03-9c16-49fc-84b7-1c562b982a38', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('652ef2bd-6b9e-4504-ba96-091d84545c87', 'bce6409c-32fc-40d2-84fd-159b6f8dba0e', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('ceb4e41d-db5c-463f-8e50-35af34910d02', '6a1df6d1-5010-4aea-9cee-ee62f662764d', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('0778e9b1-ec4c-4ddc-8801-e5b9f5dfcb8b', '6d7f8d39-1229-4d39-8dc5-4eeed94a76ab', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('b195bffd-c1be-473f-a586-fdf7aef79373', '6d7f8d39-1229-4d39-8dc5-4eeed94a76ab', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('24cf9759-f431-4c3c-9cc5-50c10ba69a90', 'cc0683d5-b776-4ff9-9a09-4a6fdceda6ac', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('8931e6b0-ad26-4164-aa9e-fb6d2ac84c0b', 'c1a56db1-5bbc-4753-95b2-5a7aaf00777e', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('1c4dfff4-5916-4474-a8ad-e332323e6741', '4eb73c09-4497-438e-a7e0-2ef7c51af7a8', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('6c65053c-e717-4773-9d29-8bc48d9137c6', '492513f9-85a0-4c75-8a8d-5db01fc2704b', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('c0698975-6393-4120-a97d-f3443887e25e', '641c72f8-6f19-442b-a955-1aa699775411', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('d25e16ad-d04b-4671-a605-8ea456f9b424', 'e7faa4c5-ba70-42db-a1c2-a2ba7bb87769', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('7acd87f6-90d4-4729-a46d-51157fde5e80', '82db9f81-c3dd-42e5-b911-a239553b77ce', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('67030bfa-d613-404e-bc21-b66dbdd84793', '424a9f56-7590-4ee9-a2ff-1540cbf7827c', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('2c884057-62fe-415f-afa4-8cc633bc0d24', 'a34ae5aa-c8e9-4184-86ed-54f3e4f8dff8', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('72e49773-50aa-433b-8e84-771551100d4b', 'ef7c0d0e-1a70-4f38-8ea6-2679aed1f0fb', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('3234f9ae-1542-49e7-aa0c-5b64875c0d53', '50646cba-27e1-4013-81fb-fb546c47a3fb', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('30b8ff92-958e-4c26-8f30-af04518eeb92', 'f1fce5e1-63c1-4f13-a3e9-a4e1a70a2100', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('ad3aa718-2ac1-4abc-a7bb-ffe7c42376e1', '801cc813-ca31-4fe6-b0ec-28ec99274b7f', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('7f8a1ceb-0fe0-4d23-91f2-7ab38f30b8ed', 'f5ea825c-dae2-44fa-bbd0-caacc7e88a2d', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('d022235a-303a-40bf-900a-d200253a2acd', '4bd55f24-ed69-4a36-a09c-d379c6f0d820', NULL, NULL, '88aa0942-f8cd-4c57-b454-5f52ddf6a3f1', NULL, NOW()),
            ('1bd5b758-2cd5-4933-81d8-0a8c1bae9762', 'a03fb2a7-484f-416e-bfd2-758c47461463', NULL, NULL, 'aa2866f8-a7bc-4711-b66d-d44cdf832876', NULL, NOW()),
            ('fb7d6097-31b0-4eb2-b996-5b4545b05e2a', 'c00eda8d-98f2-4fe8-b067-c59ed7c1d755', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('003c00db-c341-406a-9ac8-d1bbbdc2d274', '99980a54-1a66-45d4-a427-2972aaa0df99', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('4c1a9cb1-6744-41f2-81e8-9ab8d05d850a', '6cd2a849-eb17-4945-909f-e633e2bae497', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('faef396d-6d87-43a4-b9e5-381d24dc669b', 'a3d954e7-f9a6-4f77-b269-2c412b0f8d05', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('017b7202-9df0-4639-bee6-b6f5316ceb09', '5ce4ecda-7f9d-4754-9cef-6559740e37c3', NULL, NULL, '88aa0942-f8cd-4c57-b454-5f52ddf6a3f1', NULL, NOW()),
            ('bbcd2183-d22d-4941-ad09-1ad503721317', '77b88354-e178-4973-8fc8-60372375ab8b', NULL, NULL, 'aa2866f8-a7bc-4711-b66d-d44cdf832876', NULL, NOW()),
            ('9beeded0-be3e-494a-9382-b945fc3e47b9', '37232e9f-0101-4965-bf67-d9f8fdcbd28d', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('e3b2098d-c762-4452-8541-fa8d25e9e2e4', '9d22e292-0900-42b9-aad8-895e683b17c8', NULL, NULL, 'ab0c7845-51f8-4092-a297-ad2d3555e163', NULL, NOW()),
            ('1c723e04-822a-47e3-b53a-8818e1d46826', '5f180dac-fb13-401d-b685-e37a238ee16a', NULL, NULL, 'ab0c7845-51f8-4092-a297-ad2d3555e163', NULL, NOW()),
            ('d90ca67f-0fe7-4b28-8c5c-6e1f578cc88d', '58519702-e878-4b2e-9797-f18a351aaf3a', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('349d6075-e275-41b6-9a45-0babb6a0f1f7', '7b160a0b-dafa-4893-8218-524e2a77df5a', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('b4d36f89-3f1d-4564-ab99-dba87dc810ce', '6bddfaa2-bab6-4c8f-8788-973422e65a23', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('1f815a4f-b641-4b59-951d-35267b9dda1e', 'fefe75d1-e3ce-4c91-ac4d-cf5def688403', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('af478b5d-04db-45df-bab2-953d3561a4b5', 'a4d63706-70d8-41ad-b746-429b3a5568bd', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('d7f27c13-9400-4ae8-9e1e-58ef0d87b697', '4170dfb7-f39d-41db-adef-97e59ac6ee79', NULL, NULL, '81de4134-d3cb-4e59-8ef4-e49913358610', NULL, NOW()),
            ('1f41230c-4d9b-44e3-bea6-db293fc9655c', '1adf856c-c24e-43fa-bfb9-f95812e44950', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW()),
            ('d8a948c4-ba77-48b8-bf06-195f008748f6', '2c93905f-5e0e-4cb6-a08a-2d9247cde37f', NULL, NULL, '897eb526-fc5b-4aca-a92f-0324d34353fc', NULL, NOW());
        `);

        console.log('upvoting activity...');
        await connection.query(`
            UPDATE other_activities
            SET upvotes = upvotes + 1
            WHERE activity_id = '666d2a3b-7dd6-42b0-b234-ede2d831aa7f';
        `);

        console.log('\nDatabase Seeding Complete!\n');
    } catch (error) {
        console.error('\nError seeding database:', error.message);
    } finally {
        await connection.end();
    }
}

// Execute the seeding function
seedDatabase();
