
$ (function () {
	var Aaca = `aacaacabcabaaac`;
	var Dova = `Dovahkiin, Dovahkiin, naal ok zin los vahriin,
Wah dein vokul mahfaeraak ahst vaal!
Ahrk fin norok paal graan fod nust hon zindro zaan,
Dovahkiin, fah hin kogaan mu draal!

Huzrah nu, kul do od, wah aan bok lingrah vod,
Ahrk fin tey, boziik fun, do fin gein!
Wo lost fron wah ney dov, ahrk fin reyliik do jul,
Voth aan suleyk wah ronit faal krein

Ahrk fin zul, rok drey kod, nau tol morokei frod,
Rul lot Taazokaan motaad voth kein!
Sahrot Thu'um, med aan tuz, vey zeim hokoron pah,
Ol fin Dovahkiin komeyt ok rein!

Dovahkiin, Dovahkiin, naal ok zin los vahriin,
Wah dein vokul mahfaeraak ahst vaal!
Ahrk fin norok paal graan fod nust hon zindro zaan,
Dovahkiin, fah hin kogaan mu draal!

Ahrk fin Kel lost prodah, do ved viing ko fin krah,
Tol fod zeymah win kein meyz fundein!
Alduin, feyn do jun, kruziik vokun staadnau,
Voth aan bahlok wah diivon fin lein!

Nuz aan sul, fent alok, fod fin vul dovah nok,
Fen kos nahlot mahfaeraak ahrk ruz!
Paaz Keizaal fen kos stin nol bein Alduin jot,
Dovahkiin kos fin saviik do muz!

Dovahkiin, Dovahkiin, naal ok zin los vahriin,
Wah dein vokul mahfaeraak ahst vaal!
Ahrk fin norok paal graan fod nust hon zindro zaan
Dovahkiin, fah hin kogaan mu draal!`;
	var Alice = `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?'`;
	var Powers = "";
	for (var i = 0; i < 31; i++) {
		Powers += (1 << i);
	}
	var Pi = `3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198`;
	var Random = "";
	for (var i = 0; i < 1000; i++) {
		var d = Math.floor (Math.pow (2, Math.random () * 3.1)) - 1;
		Random += String.fromCharCode (d + 97);
	}
	var UnicodeHi = ""
		+ "Here are some characters that take two bytes to represent:\n"
		+ "Ⅷ = U+2167, ⨌ = U+2A0C\n"
		+ "\n"
		+ "The following characters take three bytes to represent, and all share a common two-byte prefix. They range from U+28000 to U+2800F:\n"
		+ "𨀀𨀁𨀂𨀃𨀄𨀅𨀆𨀇𨀈𨀉𨀊𨀋𨀌𨀍𨀎𨀏\n\n"
		+ "Try UTF-8 instead of UTF-16 to lower the size of literals. Note that UTF-16 uses a surrogate pair (each end of size 2 bytes) to display a single 3-byte character.";

	$ ("#setAaca").click (function () {
		$ ('#input').val (Aaca);
		refresh ();
	});
	$ ("#setDova").click (function () {
		$ ('#input').val (Dova);
		refresh ();
	});
	$ ("#setAlice").click (function () {
		$ ('#input').val (Alice);
		refresh ();
	});
	$ ("#setPowers").click (function () {
		$ ('#input').val (Powers);
		refresh ();
	});
	$ ("#setPi").click (function () {
		$ ('#input').val (Pi);
		refresh ();
	});
	$ ("#setRandom").click (function () {
		$ ('#input').val (Random);
		refresh ();
	});
	$ ("#setUnicodeHi").click (function () {
		$ ('#input').val (UnicodeHi);
		refresh ();
	});
});

$ (function () {
	refresh ();

	function numericInput () {
		var i = parseInt ($ (this).val ());
		if (isNaN (i)) {
			$ (this).val (0);
			return;
		}
		refresh ();
	}

	$ ("#input").on ('input', refresh);
	$ ("#offsetBits").change (numericInput);
	$ ("#lengthBits").change (numericInput);
	$ ("#minLength").change (numericInput);
	$ ("#showBits").change (refresh);
	$ ("#encodeUtf8").change (refresh);

	$ ("#enableAdvanced").click (function () {
		$ (".advanced").toggleClass ('advanced');
		$ ("#enableAdvanced").remove ();
	});
});


function prepareLzItem (s) {
	return s
		.replace (" ", "·") // "␠"
		.replace ("\t", "↦") // "␉"
		.replace ("\r", "↩") // "␍"
		.replace ("\n", "↲") // "␊"
		;
}

function toUtf8 (text) {
	var utf8 = unescape (encodeURIComponent (text));
	return utf8;
}

function render (lzss, showBits) {
	/*
	 * Function to highlight referenced letters.
	 */
	var mouseRefNode = function (entering, i) {
		if (entering) {
			$ ("#output .refby-" + i).addClass ('activeRefSource');
		} else {
			$ ("#output .refby-" + i).removeClass ('activeRefSource');
		}
	};

	/*
	 * Create visual elements
	 */
	$ ('#output').empty ();
	for (var i = 0; i < lzss.length; i++) {
		var it = lzss[i];
		var add = "<div class='lzelem'>";

		add += "<div class='" + (it.lit ? "lzlit" : "lzref") + "'>";

		for (var ci = 0; ci < it.len; ci++) {
			add += "<span class='";
			for (var iref = 0; iref < it.referenced.length; iref++) {
				var ref = it.referenced[iref];
				var p0 = ref[0];
				var p1 = ref[1];
				var by = ref[2];
				if (p0 <= ci && ci <= p1) {
					add += "refby-" + by + " ";
				}
			}
			add += "'>";
			add += prepareLzItem (it.text[ci]);
			add += "</span>";
		}

		add += "</div>";


		if (showBits) {
			add += "<div class='lzsubscript lzbits'>"
				+ it.bits
				+ "</div>";
		}

		if (!it.lit) {
			add += "<div class='lzsubscript lzrefval'>"
				+ "[" + it.offset + "," + it.len + "]"
				+ "</div>";
		}

		add += "</div>";

		$ (add)
			.mouseenter (mouseRefNode.bind (this, true, i))
			.mouseleave (mouseRefNode.bind (this, false, i))
			.appendTo ('#output');
	}
}
function refresh () {
	/*
	 * text and encoding
	 */
	var text = $ ('#input').val ();
	var showBits = $ ('#showBits').prop ('checked');
	var encodeUtf8 = $ ('#encodeUtf8').prop ('checked');

	/*
	 * convert text to Utf8
	 */
	var litRawBits;
	if (encodeUtf8) {
		text = toUtf8 (text);
		litRawBits = 8;
	} else {
		litRawBits = 16;
	}
	var litBits = litRawBits + 1;

	/*
	 * offset and length
	 */
	var dictSizeBits = parseInt ($ ('#offsetBits').val ());
	var matchSizeBits = parseInt ($ ('#lengthBits').val ());
	var refBits = 1 + dictSizeBits + matchSizeBits;

	var computedMinMatchLength = Math.ceil ((refBits + 1) / litBits);
	$ ('#minLength').attr ("min", computedMinMatchLength);

	var minMatchLength = parseInt ($ ('#minLength').val ());
	if (minMatchLength < computedMinMatchLength) {
		minMatchLength = computedMinMatchLength;
		$ ('#minLength').val (computedMinMatchLength);
	}

	var dictSize = 1 << dictSizeBits;
		var maxMatchLength = matchSizeBits == 0
		? 0
		: 1 << matchSizeBits;
		maxMatchLength += minMatchLength;

	$ ('#refSizeInfo').text (""
		+ "A reference will take "
		+ "1 + " + dictSizeBits + " + " + matchSizeBits + " = "
		+ refBits + " bits.");
	$ ('#litSizeInfo').text (""
		+ "A literal will take "
		+ "1 + " + litRawBits + " = "
		+ litBits + " bits.");
	$ ('#dictRange').text ("1 to " + dictSize);
		$ ('#matchRange').text (minMatchLength + " to " + maxMatchLength);

	/*
	 * compress
	 */
	var lzss = [];
	var cursor = 0;
	var index = 0;
	while (cursor < text.length) {
		var bestOffset = 0;
		var bestLen = 0;

		for (var offset = 1; offset <= dictSize && cursor - offset >= 0; offset++) {
			var len = 0;
			while (true
			&& (cursor + len < text.length)
			&& (len < maxMatchLength)
			&& (text[cursor - offset + len] == text[cursor + len])
				) {
				len++;
			}
			if (len > bestLen) {
				bestLen = len;
				bestOffset = offset;
			}
		}

		var it = {
			pos: cursor,
			index: index,
			referenced: [],
		};

		if (bestLen < minMatchLength) {
			it.text = text[cursor];
			it.lit = true;
			it.bits = litBits;
			it.len = 1;
			cursor++;
		}
		else {
			it.text = text.substr (cursor - bestOffset, bestLen);
			it.lit = false;
			it.bits = refBits;
			it.offset = bestOffset;
			it.len = bestLen;
			cursor += bestLen;
		}

		lzss.push (it);
		index++;
	}
	text = null;
	cursor = null;

	/*
	 * Function to find element index for position.
	 * Could use a lookup table or binary search, too.
	 */
	function findBlockAtPosition (pos, maxIndex) {
		for (var spanindex = maxIndex; spanindex >= 0; spanindex--) {
			var span = lzss[spanindex];
			if (span.pos <= pos) {
				//console.log ("block " + spanindex + " covers " + span.pos + " to " + (span.pos + span.len - 1));
				return span;
			}
		}
	}

	/*
	 * Let referenced elements link to their sources.
	 */
	for (var i = 0; i < lzss.length; i++) {
		var it = lzss[i];
		if (it.lit) {
			continue;
		}

		var searchBeg = it.pos - it.offset;
		var searchEnd = searchBeg + it.len - 1;
		var end = findBlockAtPosition (searchEnd, it.index);
		var beg = findBlockAtPosition (searchBeg, end.index);

		for (var spanindex = beg.index; spanindex <= end.index; spanindex++) {
			var span = lzss[spanindex];
			var off0 = span == beg ? searchBeg - beg.pos : 0;
			var off1 = span == end ? searchEnd - end.pos : span.len - 1;
			var covered = [off0, off1, i];
			//console.log ("lzss " + i + " references " + spanindex + " with range " + covered);
			span.referenced.push (covered);
		}
	}

	render (lzss, showBits);
}
