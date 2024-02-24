---
title: "how to synchronize multiple AVAudioPlayers in iOS Swift"
date: "2017-11-20"
---

i build a small app that [plays my tracks](http://www.xorcoremusic.com) and let's the user control the volume of each channel in the track (drums,bass,sfx,synths) - for some interactive listening.

the main issue i stumbled upon was synchronizing multiple AVAudioPlayr objects, each with their own async agenda. :)

So here's the code:

this one initializes a player object based on the name of the .mp3 file you give it

```
bassPlayer  = initPlayer("Bass")  // e.g. will load "Bass.mp3"
```

```
    private func initPlayer(_ filename: String) -> AVAudioPlayer {
        let path: String! = Bundle.main.resourcePath?.appending("/\(filename).mp3")
        let mp3 = NSURL(fileURLWithPath: path)
        var player: AVAudioPlayer = AVAudioPlayer()
        do {
            player = try AVAudioPlayer(contentsOf: mp3 as URL)
            player.prepareToPlay() // <-- important!
        } catch {
              // error
        }
        return player
    }


// and then when you play, sync by taking one channel's position on the mp3 and assign it to the other channels:

private func playMusic() {

            let position = drumsPlayer.currentTime // this will be aour anchor position
            bassPlayer.currentTime = position
            synthPlayer.currentTime = position
            // etc for all your channels
            
            // and then you can play - knowing they are synced!
            drumsPlayer.play()
            bassPlayer.play()
            synthPlayer.play() // etc...
}
```

 

hope this helps you with building ios swift apps that play multiple avaudioplayer instances in concurrency - [and if you're interested in my music, check it out here](http://www.xorcoremusic.com)
