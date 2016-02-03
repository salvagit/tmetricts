# tmetricts
Example for Twitter Stream API.

## Install
<pre>
    git clone https://github.com/lortmorris/tmetricts
    cd tmetrics
    npm install
</pre>

## Adding targets
This example add into "targets" collection to Mauricio Macri, the actual president of Argentina, and ex president Cristina Kirchner.  
<pre>
node tools.js -cmd target -act add -fname Maurio -lname Macri -pol someData -web "http://mauriciomacri.com.ar/" -twitter "https://twitter.com/mauriciomacri" -fanpage "https://www.facebook.com/mauriciomacri/"

node tools.js -cmd target -act add -fname Cristina -lname Kirchner -pol someData -web "http://www.cfkargentina.com/" -twitter "https://twitter.com/cfkargentina" -fanpage "https://www.facebook.com/CFKArgentina/" 
</pre>

After adding a new target, the tools.js system return the _id of new target. This is important because you need for add a new Keyword for track.

## Adding keywords
If you'd like add a new Keyword for target Maurio Macri for track, use:
<pre>
node tools.js -cmd target -act key -key "Maurio Macri" -target 56b24c445e005c01cca7dffc
</pre>

Note: reeplace 56b24c445e005c01cca7dffc for you id returned after added the target.

## Run monitor

<pre>
node monitor
</pre>