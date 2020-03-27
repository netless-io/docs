---
id: visual-rectangle
title: How to use the adaptation screen
---

> Teachers and students use a variety of different screen size devices to use the whiteboard. The most feared problem is that because the screen size is different, the content they see each other is different, so the teaching is difficult . In this article, we will explain in detail how to complete this setting through several APIs of the whiteboard.

## What is perspective follow and visual rectangle

- In the first half of the demonstration, the student will follow the movement of the teacher. The concept is **perspective follow**.
- In the second half of the presentation, although the teacher and student are not the same in proportion and size, the blue frame can be displayed completely, because in the following state, the student will show the full content of the teacher to the maximum extent during the meeting. The concept is **visual rectangle**

## How to use these features

1. Pay attention to the following code

    ``` ts
        room.setViewMode(ViewMode.Follower); // The caller follows the user set to Broadcaster
        room.setViewMode(ViewMode.Broadcaster); // The caller lets other users follow themselves
        room.setViewMode(ViewMode.Freedom); // The caller does not follow anyone and the perspective is in free mode
        room.disableCameraTransform = true // The caller is forbidden to move the perspective, often students
        room.disableCameraTransform = false // The caller is allowed to move the perspective, often the teacher
    ```

2. Recommended usage

    ``` ts
        room.setViewMode(ViewMode.Follower); // Student follows teacher
        room.setViewMode(ViewMode.Broadcaster); // Teacher set as anchor
        room.disableCameraTransform = true // Students forbid zoom to change perspective
        room.disableCameraTransform = false // Teacher allows zoom to change perspective
    ```

   In this way, students will not follow the teacher to fail, and always ensure that the whiteboard picture is consistent
