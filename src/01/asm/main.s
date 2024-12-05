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
	lda	#<hello_str
	ldx	#>hello_str
	jsr	print_string

	; open file
	lda	#<open_str
	ldx	#>open_str
	jsr	print_string

	jsr	PRODOS
	.byte	OPEN
	.word	open_args
	beq	:+
	jmp	error
:
	; Set newline
	lda	open_ref_num
	sta	newline_ref_num
	jsr	PRODOS
	.byte	NEWLINE
	.word	newline_args
	bne	error

	; Read one line into memory
	lda	open_ref_num
	sta	read_ref_num

read_next_line:
	jsr	PRODOS
	.byte	READ
	.word	read_args
	bne	error

	stz	read_buffer+512
	lda	#<read_buffer
	ldx	#>read_buffer
	jsr	print_string

	ldy	#$00
	jsr	read_long

	; Add long_a to list_a
	; jsr	add_to_list_a
	jsr	insert_list_a

; 	lda	tmp
; 	beq	:+
; 	brk
; :
	inc	tmp
	; advance read ptr_a
	dey
:	iny
	lda	read_buffer,Y
	cmp	#$A0
	beq	:-

	jsr	read_long

	; jsr	add_to_list_b
	jsr	insert_list_b


	jmp	read_next_line

	;lda	long_a + 2
	;jsr	PRBYTE
	;lda	long_a + 1
	;jsr	PRBYTE
	;lda	long_a
	;jsr	PRBYTE
	;lda	#$8D
	;jsr	COUT
	;jsr	COUT

end_of_file:
	; Close File
	lda	#<close_str
	ldx	#>close_str
	jsr	print_string

	; close args
	lda	open_ref_num
	sta	close_ref_num

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
	; TODO: iterate the lists, add up |list_a[i] - lisb_b[i]|
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

	inc16	ptr_a
	inc16	ptr_b
	lda	ptr_a + 1
	cmp	idx_a + 1
	bne	next_sum
	lda	ptr_a
	cmp	idx_a
	bne	next_sum

	brk
	lda	#<quit_str
	ldx	#>quit_str
	jsr	print_string

	jsr	KEYIN
	jsr	PRODOS
	.byte	QUIT
	.word	quit_args

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
	; add16	ptr_a, $02

	lda	(ptr_a),Y
	cmp	long_a + 2
	beq	cmp_byt_1
	bcs	insert		; long_a[2] <= ptr_a[2]
	; inc16	ptr_a
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
	; add16	ptr_a, $02

	lda	(ptr_a),Y
	cmp	long_a + 2
	beq	cmp_byt_1
	bcs	insert		; long_a[2] <= ptr_a[2]
	; inc16	ptr_a
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

.proc	add_to_list_a
	lda	long_a
	sta	(idx_a)
	inc	idx_a
	bne	:+
	inc	idx_a + 1
:	lda	long_a + 1
	sta	(idx_a)
	inc	idx_a
	bne	:+
	inc	idx_a + 1
:	lda	long_a + 2
	sta	(idx_a)
	inc	idx_a
	bne	:+
	inc	idx_a + 1
:	rts
.endproc

.proc	add_to_list_b
	lda	long_a
	sta	(idx_b)
	inc	idx_b
	bne	:+
	inc	idx_b + 1
:	lda	long_a + 1
	sta	(idx_b)
	inc	idx_b
	bne	:+
	inc	idx_b + 1
:	lda	long_a + 2
	sta	(idx_b)
	inc	idx_b
	bne	:+
	inc	idx_b + 1
:	rts
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

hello_str:
	scrcode	"Ted was here!"
	.byte	$8D, $00

quit_str:
	.byte	$8D
	scrcode	"Press any key to continue..."
	.byte	$00

open_str:
	scrcode	"OPEN"
	.byte	$8D, $00

close_str:
	scrcode "CLOSE"
	.byte	$8D, $00

