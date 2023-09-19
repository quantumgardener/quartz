---
title: Why Have All the Backups Failed?
tags:
  - on/backups
  - on/pkm
  - the-garden-shed
date: 2023-02-02
growth: evergreen
---
I woke this morning to a slew of emails informing me of backups that had failed due to insufficient space on the target drive. Why had they all failed? Well, it was because one had succeeded.

I use [Macrium Reflect](https://www.macrium.com/products/home) to image the main home PC each night. One the first day of the month a full backup is taken and throughout the month there is a rolling series of differential and incremental backups.

The 1 February backup was about 100GB chewing up the remaining space on my backup drive. Or did it? Because 100GB suddenly filling a 3TB drive means it was running close to the bone anyway.

I have [multiple copies of backups in accordance with the 3:2:1 rule](https://quantumgardener.blog/2022/11/20/3-2-1-backup/). Three copies, two different devices, at least one offsite. The backup of the Macrium Reflect image files was supposed to be a simple file copy to another device. The file size should be 1:1. Instead, due to a small configuration error on my part, I was backing up the image files, and not simply copying them to another location. The backup size kept growing.

The original image files were keeping a history over the last 2 months. Each night an incremental file would be dropped and another added (14 days rotation), and differential files would be created from those incremental files. Each month the oldest full backup would be dropped as well. Perfect, that’s what should be happening. But…

The backup for my second copy was capturing each incremental file, differential file and full backup file the night they were created. With the deletion of each source incremental file, I still had a copy in the backup. It grew and grew and grew.

I’ve reset things and recovered about 1.5TB of disk space on my backup drive. All should be good.

Lessons learned:
- Ensure you have a notification method to inform you of backups failing. Had I not received emails, there was no way to know without daily inspection something was wrong. It could have been 2-3 weeks easily before I noticed. Most good quality backup software is able to email any issues. You can have it email success, or failure, or both.
- Don’t click the wrong button when setting up a backup!