	.macpack apple2
	.export	long_a, long_b, idx_a, idx_b, ptr_a, ptr_b, tmp
.macro	add16	addr, val
	clc
	lda	addr
	adc	#val
	sta	addr
	bcc	:+
	inc	addr + 1
:
.endmacro

.macro	sub16	addr, val
	sec
	lda	addr
	sbc	#val
	sta	addr
	bcs	:+
	dec	addr + 1
:
.endmacro

.macro	inc16	addr
	clc
	lda	addr
	adc	#$01
	sta	addr
	bcc	:+
	inc	addr + 1
:
.endmacro

.macro	dec16	addr
	sec
	lda	addr
	sbc	#$01
	sta	addr
	bcs	:+
	dec	addr + 1
:
.endmacro

	; System Calls
	HOME	= $FC58
	KEYIN	= $FD1B
	CROUT	= $FD8E
	PRBYTE	= $FDDA
	COUT	= $FDED
	PRERR	= $FF2D
	PRODOS	= $BF00

	; ProDOS Calls
	QUIT	= $65
	OPEN	= $C8
	NEWLINE	= $C9
	READ	= $CA
	CLOSE	= $CC

	; Buffers
	io_buffer	= $1000
	read_buffer	= $1400
	list_a		= $1800
	list_b		= $2400

	.zeropage

	.word	$0000
ptr_a:
	.word	$0000
ptr_b:
	.word	$0000
long_a:
	.byte	$00, $00, $00
long_b:
	.byte	$00, $00, $00
idx_a:
	.word	$0000
idx_b:
	.word	$0000
tmp:
	.byte	$00
line_cnt:
zero_cnt:
	.byte	$00

	.data

open_args:
	.byte	$03		; param_count
	.word	file_path	; pathname
	.word	io_buffer	; io_buffer
open_ref_num:
	.byte	$0000		; ref_num

newline_args:
	.byte	$03		; param_count
newline_ref_num:
	.byte	$00		; ref_num
	.byte	$FF		; enable_mask
	.byte	$8D		; newline_char

read_args:
	.byte	$04		; param_count
read_ref_num:
	.byte	$00		; ref_num
	.word	read_buffer	; data_buffer
	.word	$0200		; request_count
	.word	$0000		; trans_count

close_args:
	.byte	$01		; param_count
close_ref_num:
	.byte	$00		; ref_num

	.code


start:
	; initialize zeropage variables
	stz	ptr_a
	stz	ptr_a + 1
	stz	ptr_b
	stz	ptr_b + 1
	stz	long_a
	stz	long_a + 1
	stz	long_a + 2
	stz	long_b
	stz	long_b + 1
	stz	long_b + 2
	lda	#<list_a
	sta	idx_a
	lda	#>list_a
	sta	idx_a + 1
	lda	#<list_b
	sta	idx_b
	lda	#>list_b
	sta	idx_b + 1
	stz	tmp

	; Start program
	jsr	HOME
	lda	#<loading_str
	ldx	#>loading_str
	jsr	print_string

	jsr	PRODOS
	.byte	OPEN
	.word	open_args
	beq	:+
	jmp	error
:
	; Copy file ref_num to arg blocks
	lda	open_ref_num
	sta	newline_ref_num
	sta	read_ref_num
	sta	close_ref_num

	; Set newline
	jsr	PRODOS
	.byte	NEWLINE
	.word	newline_args
	bne	error

	; Read one line into memory
read_next_line:
	jsr	PRODOS
	.byte	READ
	.word	read_args
	bne	error

	ldy	#$00
	jsr	read_long

	; Add long_a to list_a
	jsr	insert_list_a

	; advance read ptr_a
	dey
:	iny
	lda	read_buffer,Y
	cmp	#$A0
	beq	:-

	jsr	read_long
	jsr	insert_list_b

	; print a '.' every 25 rows
	lda	#25
	cmp	line_cnt
	bne	:+
	stz	line_cnt
	lda	#$AE
	jsr	COUT
:
	inc	line_cnt

	bra	read_next_line

end_of_file:
	; Close File
	jsr	CROUT
	lda	#<calc_str
	ldx	#>calc_str
	jsr	print_string

	jsr	PRODOS
	.byte	CLOSE
	.word	close_args
	beq	end

error:
	cmp	#$4C		; End of File
	beq	end_of_file
	jsr	PRBYTE
	jsr	PRERR

end:
	; we now have sorted lists
	lda	#<list_a
	sta	ptr_a
	lda	#>list_a
	sta	ptr_a + 1

	lda	#<list_b
	sta	ptr_b
	lda	#>list_b
	sta	ptr_b + 1

	stz	long_a
	stz	long_a + 1
	stz	long_a + 2

next_sum:
	ldy	#$00
	sec
	lda	(ptr_a),Y
	sbc	(ptr_b),Y
	sta	long_b
	iny
	lda	(ptr_a),Y
	sbc	(ptr_b),Y
	sta	long_b + 1
	iny
	lda	(ptr_a),Y
	sbc	(ptr_b),Y
	sta	long_b + 2
	bpl	skip_negate

	; if the value is negative, get its absolute value
	lda	long_b
	eor	#$FF
	sta	long_b
	lda	long_b + 1
	eor	#$FF
	sta	long_b + 1
	lda	long_b + 2
	eor	#$FF
	sta	long_b + 2
	clc
	lda	long_b
	adc	#$01
	sta	long_b
	lda	long_b + 1
	adc	#$00
	sta	long_b + 1
	lda	long_b + 2
	adc	#$00
	sta	long_b + 2

skip_negate:
	clc
	lda	long_b
	adc	long_a
	sta	long_a
	lda	long_b + 1
	adc	long_a + 1
	sta	long_a + 1
	lda	long_b + 2
	adc	long_a + 2
	sta	long_a + 2

	add16	ptr_a, 3
	add16	ptr_b, 3
	lda	ptr_a + 1
	cmp	idx_a + 1
	bne	next_sum
	lda	ptr_a
	cmp	idx_a
	bne	next_sum

	lda	#<part_1_str
	ldx	#>part_1_str
	jsr	print_string
	jsr	print_long
	jsr	CROUT
	jsr	CROUT

	lda	#<quit_str
	ldx	#>quit_str
	jsr	print_string

	jsr	KEYIN
	jsr	PRODOS
	.byte	QUIT
	.word	quit_args

; ***************************************************************************
; * End Main Program, Begin support procedures                              *
; ***************************************************************************


; Reads the 24-bit integer at read_buffer,Y into long_a
;	modifies long_a, long_b
.proc read_long
	stz	long_a
	stz	long_a + 1
	stz	long_a + 2

next_digit:
	lda	read_buffer,Y
	cmp	#$AF
	bcc	notdigit
	; jsr	PRBYTE
	eor	#$B0			; map digits
	cmp	#$0A			; is it decimal?
	bcs	notdigit

	; long_a = long_a * 10 + A
	tax
	jsr	mul_10
	txa

	adc	long_a
	sta	long_a
	bcc	no_inc
	inc	long_a + 1
	bne	no_inc
	inc	long_a + 2
no_inc:

	iny
	bne	next_digit

notdigit:
	rts
.endproc

; prints a 24-bit unsigned decimal number
.proc print_long
	lda	#$03
	sta	zero_cnt
	ldx	#21
	ldy	#$D8
next_digit:
	sty	tmp
	lsr	long_a + 2
	ror	long_a + 1
	ror	long_a
compare:
	rol	long_a
	rol	long_a + 1
	rol	long_a + 2
	bcs	subtract
	sec
	lda	long_a
	sbc	tbl,X
	lda	long_a + 1
	sbc	tbl+1,X
	lda	long_a + 2
	sbc	tbl+2,X
	bcc	output_digit
subtract:
	lda	long_a
	sbc	tbl,X
	sta	long_a
	lda	long_a + 1
	sbc	tbl+1,X
	sta	long_a + 1
	lda	long_a + 2
	sbc	tbl+2,X
	sta	long_a + 2
	sec
output_digit:
	rol	tmp
	bcc	compare
	lda	tmp
	cmp	#$B0
	beq	digit_is_zero
	stx	zero_cnt
	bra	cout_digit
digit_is_zero:
	cpx	zero_cnt
	bcs	skip_cout
cout_digit:
	jsr	COUT
skip_cout:
	ldy	#$1B
	dex
	dex
	dex
	bpl	next_digit
	rts
tbl:
	.byte	$00, $00, $20	;          8 << 18
	.byte	$00, $00, $28	;         80 << 15
	.byte	$00, $00, $32	;        800 << 12
	.byte	$00, $80, $3E	;      8,000 << 9
	.byte	$00, $20, $4E	;     80,000 << 6
	.byte	$00, $A8, $61	;    800,000 << 3
	.byte	$00, $12, $7A	;  8,000,000
	.byte	$80, $96, $98	; 10,000,000
.endproc

.proc insert_list_a
	phy
	; ptr_a -> top of list_a
	lda	#<list_a
	sta	ptr_a
	lda	#>list_a
	sta	ptr_a + 1

next_val:
	; if ptr_a == idx_a then we are at the bottom of the list and ready
	; to insert
	lda	ptr_a + 1
	cmp	idx_a + 1
	bne	:+
	lda	ptr_a
	cmp	idx_a
	beq	insert
:
	; compare most significant byte
	ldy	#$02

	lda	(ptr_a),Y
	cmp	long_a + 2
	beq	cmp_byt_1
	bcs	insert		; long_a[2] <= ptr_a[2]
	add16	ptr_a, 3
	bra	next_val
cmp_byt_1:
	; compare next most significant byte
	; dec16	ptr_a
	dey
	lda	(ptr_a),Y
	cmp	long_a + 1
	beq	cmp_byt_0
	bcs	insert		; long_a[1] <= ptr_a[1]
	add16	ptr_a, 3
	bra	next_val
cmp_byt_0:
	; compare least significant byte
	; dec16	ptr_a
	dey
	lda	(ptr_a),Y
	cmp	long_a
	beq	insert
	bcs	insert
	add16	ptr_a, 3
	bra	next_val

insert:
	; we need to shift everything in the list down to make room for
	; the new value

	; then, go to the end of the list and start copying each byte to be
	; 3 bytes further down
	ldy	#$03
	lda	idx_a
	sta	ptr_b
	lda	idx_a + 1
	sta	ptr_b + 1

shift_next:	; if ptr_a == ptr_b end loop
	lda	ptr_b + 1
	cmp	ptr_a + 1
	bne	:+
	lda	ptr_b
	cmp	ptr_a
	beq	shift_done
:
	dec16	ptr_b
	lda	(ptr_b)
	sta	(ptr_b),Y
	bra	shift_next

shift_done:
	; long_a -> (ptr_a)
	lda	long_a
	sta	(ptr_a)
	inc16	ptr_a
	lda	long_a + 1
	sta	(ptr_a)
	inc16	ptr_a
	lda	long_a + 2
	sta	(ptr_a)

	add16	idx_a, $03
	ply
	rts
.endproc

.proc insert_list_b
	phy
	; ptr_a -> top of list_a
	lda	#<list_b
	sta	ptr_a
	lda	#>list_b
	sta	ptr_a + 1

next_val:
	; if ptr_a == idx_a then we are at the bottom of the list and ready
	; to insert
	lda	ptr_a + 1
	cmp	idx_b + 1
	bne	:+
	lda	ptr_a
	cmp	idx_b
	beq	insert
:
	; compare most significant byte
	ldy	#$02

	lda	(ptr_a),Y
	cmp	long_a + 2
	beq	cmp_byt_1
	bcs	insert		; long_a[2] <= ptr_a[2]
	add16	ptr_a, 3
	bra	next_val
cmp_byt_1:
	; compare next most significant byte
	; dec16	ptr_a
	dey
	lda	(ptr_a),Y
	cmp	long_a + 1
	beq	cmp_byt_0
	bcs	insert		; long_a[1] <= ptr_a[1]
	add16	ptr_a, 3
	bra	next_val
cmp_byt_0:
	; compare least significant byte
	; dec16	ptr_a
	dey
	lda	(ptr_a),Y
	cmp	long_a
	beq	insert
	bcs	insert
	add16	ptr_a, 3
	bra	next_val

insert:
	; we need to shift everything in the list down to make room for
	; the new value

	; then, go to the end of the list and start copying each byte to be
	; 3 bytes further down
	ldy	#$03
	lda	idx_b
	sta	ptr_b
	lda	idx_b + 1
	sta	ptr_b + 1

shift_next:	; if ptr_a == ptr_b end loop
	lda	ptr_b + 1
	cmp	ptr_a + 1
	bne	:+
	lda	ptr_b
	cmp	ptr_a
	beq	shift_done
:
	dec16	ptr_b
	lda	(ptr_b)
	sta	(ptr_b),Y
	bra	shift_next

shift_done:
	; long_a -> (ptr_a)
	lda	long_a
	sta	(ptr_a)
	inc16	ptr_a
	lda	long_a + 1
	sta	(ptr_a)
	inc16	ptr_a
	lda	long_a + 2
	sta	(ptr_a)

	add16	idx_b, $03
	ply
	rts
.endproc

; Multiplies the 24-bit number in long_a by 10
; Stores the result in long_a
; long_a * 10 = long_a * 8 + long_a * 2 = long_a << 3 + long_a << 1
;	modifies A, long_a, long_b
.proc mul_10
	asl	long_a
	rol	long_a + 1
	rol	long_a + 2
	lda	long_a + 2
	sta	long_b + 2
	lda	long_a + 1
	sta	long_b + 1
	lda	long_a
.repeat 2
	asl	A
	rol	long_b + 1
	rol	long_b + 2
.endrepeat
	clc
	adc	long_a
	sta	long_a
	lda	long_b + 1
	adc	long_a + 1
	sta	long_a + 1
	lda	long_b + 2
	adc	long_a + 2
	sta	long_a + 2
	rts
.endproc

; Prints the NULL-terminated string at A,X
;	modifies A, Y, and ptr_a
.proc print_string
	sta	ptr_a
	stx	ptr_a+1
	ldy	#$00
next_char:
	lda	(ptr_a),Y
	beq	end
	jsr	COUT
	iny
	bne	next_char
end:	rts
.endproc

	.rodata
quit_args:
	.byte	$04		; number of paremeters
	.byte	$00		; quit type
	.byte	$00, $00	; reserved for future use
	.byte	$00		; reserved for future use
	.byte	$00, $00	; reserved for future use

file_path:
	.byte	.strlen("INPUT"), "INPUT"

loading_str:
	scrcode	"Loading and sorting numbers"
	.byte	$8D, $00

calc_str:
	scrcode "Calculating value..."
	.byte	$8D, $8D, $00

part_1_str:
	scrcode "Part 1: "
	.byte	$00

quit_str:
	scrcode "Press any key to continue"
	.byte	$8D, $8D, $00

