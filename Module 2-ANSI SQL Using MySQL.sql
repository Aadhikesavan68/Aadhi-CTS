-- Module 2 - ANSI SQL Using MySQL
-- Query answers for the exercises in the PDF.

-- 1. User Upcoming Events
SELECT
    u.user_id,
    u.full_name,
    u.city AS user_city,
    e.event_id,
    e.title,
    e.start_date,
    e.end_date
FROM Users u
JOIN Registrations r
    ON r.user_id = u.user_id
JOIN Events e
    ON e.event_id = r.event_id
WHERE e.status = 'upcoming'
  AND e.city = u.city
ORDER BY e.start_date;

-- 2. Top Rated Events
WITH event_ratings AS (
    SELECT
        e.event_id,
        e.title,
        AVG(f.rating) AS avg_rating,
        COUNT(f.feedback_id) AS feedback_count
    FROM Events e
    JOIN Feedback f
        ON f.event_id = e.event_id
    GROUP BY e.event_id, e.title
    HAVING COUNT(f.feedback_id) >= 10
),
max_rating AS (
    SELECT MAX(avg_rating) AS max_avg_rating
    FROM event_ratings
)
SELECT
    er.event_id,
    er.title,
    ROUND(er.avg_rating, 2) AS avg_rating,
    er.feedback_count
FROM event_ratings er
JOIN max_rating mr
    ON er.avg_rating = mr.max_avg_rating;

-- 3. Inactive Users
SELECT
    u.user_id,
    u.full_name,
    u.email,
    u.city,
    u.registration_date
FROM Users u
LEFT JOIN Registrations r
    ON r.user_id = u.user_id
   AND r.registration_date >= CURDATE() - INTERVAL 90 DAY
WHERE r.registration_id IS NULL;

-- 4. Peak Session Hours
SELECT
    e.event_id,
    e.title,
    COUNT(s.session_id) AS sessions_between_10am_and_12pm
FROM Events e
LEFT JOIN Sessions s
    ON s.event_id = e.event_id
   AND TIME(s.start_time) >= '10:00:00'
   AND TIME(s.start_time) < '12:00:00'
GROUP BY e.event_id, e.title
ORDER BY e.event_id;

-- 5. Most Active Cities
SELECT
    u.city,
    COUNT(DISTINCT r.user_id) AS distinct_user_registrations
FROM Users u
JOIN Registrations r
    ON r.user_id = u.user_id
GROUP BY u.city
ORDER BY distinct_user_registrations DESC, u.city
LIMIT 5;

-- 6. Event Resource Summary
SELECT
    e.event_id,
    e.title,
    SUM(CASE WHEN res.resource_type = 'pdf' THEN 1 ELSE 0 END) AS pdf_count,
    SUM(CASE WHEN res.resource_type = 'image' THEN 1 ELSE 0 END) AS image_count,
    SUM(CASE WHEN res.resource_type = 'link' THEN 1 ELSE 0 END) AS link_count,
    COUNT(res.resource_id) AS total_resources
FROM Events e
LEFT JOIN Resources res
    ON res.event_id = e.event_id
GROUP BY e.event_id, e.title
ORDER BY e.event_id;

-- 7. Low Feedback Alerts
SELECT
    u.user_id,
    u.full_name,
    e.event_id,
    e.title,
    f.rating,
    f.comments,
    f.feedback_date
FROM Feedback f
JOIN Users u
    ON u.user_id = f.user_id
JOIN Events e
    ON e.event_id = f.event_id
WHERE f.rating < 3
ORDER BY f.feedback_date, u.full_name;

-- 8. Sessions per Upcoming Event
SELECT
    e.event_id,
    e.title,
    COUNT(s.session_id) AS session_count
FROM Events e
LEFT JOIN Sessions s
    ON s.event_id = e.event_id
WHERE e.status = 'upcoming'
GROUP BY e.event_id, e.title
ORDER BY e.start_date;

-- 9. Organizer Event Summary
SELECT
    u.user_id AS organizer_id,
    u.full_name AS organizer_name,
    e.status,
    COUNT(e.event_id) AS event_count
FROM Events e
JOIN Users u
    ON u.user_id = e.organizer_id
GROUP BY u.user_id, u.full_name, e.status
ORDER BY u.full_name, e.status;

-- 10. Feedback Gap
SELECT DISTINCT
    e.event_id,
    e.title,
    e.city,
    e.start_date,
    e.status
FROM Events e
JOIN Registrations r
    ON r.event_id = e.event_id
LEFT JOIN Feedback f
    ON f.event_id = e.event_id
WHERE f.feedback_id IS NULL
ORDER BY e.start_date;

-- 11. Daily New User Count
SELECT
    u.registration_date,
    COUNT(*) AS new_user_count
FROM Users u
WHERE u.registration_date >= CURDATE() - INTERVAL 6 DAY
GROUP BY u.registration_date
ORDER BY u.registration_date;

-- 12. Event with Maximum Sessions
WITH session_counts AS (
    SELECT
        e.event_id,
        e.title,
        COUNT(s.session_id) AS session_count
    FROM Events e
    LEFT JOIN Sessions s
        ON s.event_id = e.event_id
    GROUP BY e.event_id, e.title
),
max_sessions AS (
    SELECT MAX(session_count) AS max_session_count
    FROM session_counts
)
SELECT
    sc.event_id,
    sc.title,
    sc.session_count
FROM session_counts sc
JOIN max_sessions ms
    ON sc.session_count = ms.max_session_count;

-- 13. Average Rating per City
SELECT
    e.city,
    ROUND(AVG(f.rating), 2) AS average_rating
FROM Events e
JOIN Feedback f
    ON f.event_id = e.event_id
GROUP BY e.city
ORDER BY e.city;

-- 14. Most Registered Events
SELECT
    e.event_id,
    e.title,
    COUNT(r.registration_id) AS registration_count
FROM Events e
JOIN Registrations r
    ON r.event_id = e.event_id
GROUP BY e.event_id, e.title
ORDER BY registration_count DESC, e.event_id
LIMIT 3;

-- 15. Event Session Time Conflict
SELECT
    s1.event_id,
    e.title,
    s1.session_id AS session_1_id,
    s1.title AS session_1_title,
    s1.start_time AS session_1_start,
    s1.end_time AS session_1_end,
    s2.session_id AS session_2_id,
    s2.title AS session_2_title,
    s2.start_time AS session_2_start,
    s2.end_time AS session_2_end
FROM Sessions s1
JOIN Sessions s2
    ON s1.event_id = s2.event_id
   AND s1.session_id < s2.session_id
   AND s1.start_time < s2.end_time
   AND s2.start_time < s1.end_time
JOIN Events e
    ON e.event_id = s1.event_id
ORDER BY s1.event_id, s1.session_id, s2.session_id;

-- 16. Unregistered Active Users
SELECT
    u.user_id,
    u.full_name,
    u.email,
    u.city,
    u.registration_date
FROM Users u
WHERE u.registration_date >= CURDATE() - INTERVAL 30 DAY
  AND NOT EXISTS (
      SELECT 1
      FROM Registrations r
      WHERE r.user_id = u.user_id
  )
ORDER BY u.registration_date DESC;

-- 17. Multi-Session Speakers
SELECT
    s.speaker_name,
    COUNT(*) AS session_count
FROM Sessions s
GROUP BY s.speaker_name
HAVING COUNT(*) > 1
ORDER BY session_count DESC, s.speaker_name;

-- 18. Resource Availability Check
SELECT
    e.event_id,
    e.title,
    e.city,
    e.status
FROM Events e
LEFT JOIN Resources res
    ON res.event_id = e.event_id
WHERE res.resource_id IS NULL
ORDER BY e.event_id;

-- 19. Completed Events with Feedback Summary
SELECT
    e.event_id,
    e.title,
    (
        SELECT COUNT(*)
        FROM Registrations r
        WHERE r.event_id = e.event_id
    ) AS total_registrations,
    (
        SELECT ROUND(AVG(f.rating), 2)
        FROM Feedback f
        WHERE f.event_id = e.event_id
    ) AS average_feedback_rating
FROM Events e
WHERE e.status = 'completed'
ORDER BY e.event_id;

-- 20. User Engagement Index
SELECT
    u.user_id,
    u.full_name,
    COUNT(DISTINCT r.event_id) AS events_attended,
    COUNT(DISTINCT f.feedback_id) AS feedbacks_submitted
FROM Users u
LEFT JOIN Registrations r
    ON r.user_id = u.user_id
LEFT JOIN Feedback f
    ON f.user_id = u.user_id
GROUP BY u.user_id, u.full_name
ORDER BY u.user_id;

-- 21. Top Feedback Providers
SELECT
    u.user_id,
    u.full_name,
    COUNT(f.feedback_id) AS feedback_count
FROM Users u
JOIN Feedback f
    ON f.user_id = u.user_id
GROUP BY u.user_id, u.full_name
ORDER BY feedback_count DESC, u.user_id
LIMIT 5;

-- 22. Duplicate Registrations Check
SELECT
    r.user_id,
    u.full_name,
    r.event_id,
    e.title,
    COUNT(*) AS duplicate_count
FROM Registrations r
JOIN Users u
    ON u.user_id = r.user_id
JOIN Events e
    ON e.event_id = r.event_id
GROUP BY r.user_id, u.full_name, r.event_id, e.title
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, r.user_id, r.event_id;

-- 23. Registration Trends
SELECT
    DATE_FORMAT(r.registration_date, '%Y-%m') AS registration_month,
    COUNT(*) AS registration_count
FROM Registrations r
WHERE r.registration_date >= DATE_FORMAT(CURDATE() - INTERVAL 11 MONTH, '%Y-%m-01')
GROUP BY DATE_FORMAT(r.registration_date, '%Y-%m')
ORDER BY registration_month;

-- 24. Average Session Duration per Event
SELECT
    e.event_id,
    e.title,
    ROUND(AVG(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time)), 2) AS average_session_duration_minutes
FROM Events e
JOIN Sessions s
    ON s.event_id = e.event_id
GROUP BY e.event_id, e.title
ORDER BY e.event_id;

-- 25. Events Without Sessions
SELECT
    e.event_id,
    e.title,
    e.city,
    e.status
FROM Events e
LEFT JOIN Sessions s
    ON s.event_id = e.event_id
WHERE s.session_id IS NULL
ORDER BY e.event_id;