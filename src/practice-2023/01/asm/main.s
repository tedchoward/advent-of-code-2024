	; .export ptr, L, H, B, FIRST_SET, FIRST, LAST, SUM

	.code
	ptr	= $06
	B	= $FA
	L	= $08
	H	= $09
	FIRST_SET	= $1E
	FIRST	= $EB
	LAST	= $EC
	SUM	= $ED


	LF = $0A

start:
	stz	ptr
	stz	ptr+1
	stz	L
	stz	H
	stz	FIRST_SET
	stz	FIRST
	stz	LAST
	stz	SUM
	stz	SUM+1
	lda	#<puzzle_input
	sta	ptr
	lda	#>puzzle_input
	sta	ptr+1
	jmp	load_char

next_char:
	inc	ptr
	bne	load_char
	inc	ptr+1
load_char:
	lda	(ptr),y
	bne	:+
	brk
:	cmp	#LF
	beq	process_line

	cmp	#$2F		; ignore all chars below '0'
	bcc	next_char
	eor	#$30		; map ascii to decimal to digit 0-9
	cmp	#$0A		; is it a digit?
	bcs	next_char
	ldx	FIRST_SET
	bne	set_last
	dex
	stx	FIRST_SET
	sta	FIRST
set_last:
	sta	LAST
	jmp	next_char


process_line:
	ldx	#$00
	stx	L
	stx	H
	lda	FIRST
	sta	L

	jsr	mul_10
	lda	LAST
	clc
	adc	L
	sta	L
	bcc	:+
	inc	H
:
	clc
	lda	SUM
	adc	L
	sta	SUM
	lda	SUM+1
	adc	H
	sta	SUM+1

	ldx	#$00
	stx	FIRST_SET
	brk
	jmp	next_char

; Multiplies the 16-bit number in LH by 10
; Stores the result in LH
; LH * 10 = LH * 8 + LH * 2 = LH << 3 + LH << 1
.proc mul_10
	asl	L
	rol	H
	lda	H
	sta	B
	lda	L
.repeat 2
	asl	A
	rol	B
.endrepeat
	clc
	adc	L
	sta	L
	lda	B
	adc	H
	sta	H
	rts
.endproc

	.segment "RODATA"

puzzle_input:
	.incbin	"input.txt"
	.byte	$00		; NULL terminate the data
