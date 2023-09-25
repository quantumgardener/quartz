---
date: 2022-11-20
tags:
  - on/backups
growth: evergreen
landscapes:
  - "[[the-garden-shed]]"
---
I want to talk about backups. They are important, and always have been. Unlike grabbing photo albums on the way of of the house during a fire, the right backup system means we can focus on saving the most important thing in the house - ourselves.

Today everyone will tell you to follow a 3-2-1 backup strategy.

- 3 copies
- using at least 2 physical media
- and 1 offsite.

For example, my family’s photos are stored on an SSD within the main home PC. 1 copy, 1 physical media, not offsite. I use [[SyncBack Pro]] to copy them to a NAS daily. Now I have 2 copies, 2 physical media and none offsite. I then use SyncBack Pro again to copy them to Amazon-compatible cloud storage. 3 copies, 2 physical media, 1 offsite. I’ve hit the 3-2-1 rule.

In reality, the backup of my photos is a little more complex as it considers a couple of other factors. Let me take you on the same journey my photos take. You don’t need to do this yourself. Backup is always about “enough”.

## PC to NAS-01

My photo management tool of choice is [[IMatch]]. They are stored on an internal-SSD in year/month/day folders. IMatch provides metadata management across the folders. I need to “back up” two items. The folders and the database. For this I use SyncBack Pro, set to mirror nightly to a Synology NAS. 

Mirroring means all changes made each day are copies to the NAS. The result is an exact copy. Modify the source file and the destination is modified as well. New files are added and deleted files are deleted.

For reasons that will become apparent, it’s better to call this a “copy” rather than a “backup”.

## NAS-01 to NAS-02

An important backup concept you’ll hear in business is Recovery Point Objective (RPO). This is “how far back in time do I need to recover from?”.   
In my system, at this point, my RPO is zero. Once that mirror process runs, I can’t go back.   
Therefore, I need a backup of the content. Something that allows me to go back and recover from a previous point in time. The “backup” keeps multiple versions. Lots to learn here about retention periods and pruning, but the main differences is, “I can get an earlier version if I need to, even recover a file that was deleted."

For this, I run [[Hyper Backup]] on the Synology NAS and am fortunate enough to have a second NAS to back up to. Now my RPO is 1 year.

## NAS-02 copied to the cloud

The files that make up the backup bear no resemblance to the original photo jpeg files. Most backup software will build a database of what it has stored, and create a large number of fixed size bucket files. Hyper Backup files are about 50mb. Either they are a mix of multiple photos, or if a photo is larger (video is), then it will span multiple 50mb files. This is a good thing.

To get my files offsite I need to copy them to a cloud location. One 450gb file won’t ever get upload. 1000’s of 50mb files will. I think my first backup to the cloud was 30,000 files. It’s taken 8.5 days! Could you imagine being at the end of a 450gb file and having a connection drop!

There is another benefit of backup software. Encryption. Until now, my files are unencrypted. That’s ok at home but not at all allowed (by me) if I’m to store them offsite.

Hyper Backup (and most other backup software) allows me to specify an encryption key. The 30,000 files I uploaded were all encrypted. Only I hold the key and that’s safely stored in my password manager. If I lose that, my backups are useless.

SyncBack Pro once again comes to my aid. It mirrors the Hyper Backup files to my Amazon compatible S3 storage. I don’t need another backup program. Creating backups of backups is probably inviting disaster.

## Recovery Time Objective

The other consideration weaving it’s way through all this is the time to recovery.

NAS 01 to PC - as fast as a file copy

NAS 02 backup to PC - pretty much as fast as a file copy

Cloud to PC - slow = days, but it is a last resort backup. At that point I’ve lost at least 3 pieces of hardware so my attention is probably elsewhere anyway.

## For God’s sake, test

There is some complexity here. And I tested as I built it. I’ll also periodically monitor backups are occurring and test a restore. No matter what you personally decide to do, test you are backing up what you think and know how to recover it

I hope this has helped you understand backups a little more than before. There are lots of resources out there, usually provided by the backup software providers themselves.

## Review

1. Know what you need to back up, and how long you may need to recover backwards in time
2. Work towards 3-2-1 backups. I’m backing up to the cloud. Copying files to a USB drive and storing a copy at your office is just as good. If you’ve encrypted the backup files themselves before copying to the USB drive, you’re good. Otherwise employ some type of encryption such as BitLocker on the drive itself.
3. Test, test, test. 
4. Ask your family and friends what they do to backup files.

## Addendum - OneDrive, iCloud etc.

Microsoft and Apple spruke the backup benefits of their cloud solutions. They are better than nothing, but are not the same as a backup solution like I’ve described here.

Firstly, they have limited retention periods. Let’s say you accidentally delete a file from OneDrive and remember 100 days later that you need it. Too bad. It’s gone. Microsoft and iCloud retention periods are not as long as you think. Refer their docs for more information.

Secondly, there is versioning for OneDrive at least. That’s good, but still limited in time.

If you have an iPhone, ensure you’re syncing photos to the cloud. Pay the AUD$1.50/$4.99 for an extra 50GB/200GB to make sure you have enough space. Check your Settings for the status of your backups.
