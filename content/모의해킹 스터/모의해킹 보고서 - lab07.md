---
publish: true
title: 모의해킹 보고서 - lab07
created: 2026-10-21
modified: 2026-11-08T15:27:11.860Z
published: 2026-10-21
date: 2026-10-21
tags:
description:
lab: lab07
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 10월 21일에 진행된 lab07에 대한 모의 해킹 보고서이다.

## 2. 총평

이번 lab07 모의해킹에서는
이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해

## 3. 정보 수집 대상

개인 실습 서버 lab07을 대상으로 취약점을 점검했다. 대상 서버 lab07의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점'섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명 | 대응방안 |
| :--- | :---: | :--- | :--- |
| 웹 페이지에 비밀번호 노출 | 최상 | 웹페이지에 업로드 된 이미지에 비밀번호가 노출 | 해당 이미지는 삭제 |
| NFS의 '\*(rw, no\_root\_squash)' 설정 | 최상 | 모든 사용자가 접근이 가능<br>공유 폴더에 접근한 사용자에게 읽고 쓰기 권한 부여<br>루트로 실행하려는 요청을 그대로 실행 | \*를 신뢰할 수 있는 주소로 제한<br>rw -> ro로 변경<br>no\_root\_squash를 root\_squash로 변경 |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261109002500.png]]

포트  스캔을 해보면 `SSH`, `HTTP`, `RPC`, `NFS`, 그리고 `SSH` 포트가 `2222`로 하나 더 열려있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002507.png]]

`gobuster` 로 하위 페이지를 스캔해본다. 딕셔너리에 php 관련 목록이 부족하므로 `-x php` 옵션으로 php 페이지도 전부 검색한다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002512.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002525.png]]

업로드 디렉토리에 가보니 이미 `test.pdf.php` 파일이 있다. php로 실행이 안 된다. 이미 누군가가 실패했나보다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002530.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002535.png]]

웹사이트를 조사하다 어떤 계정의 비밀번호를 발견했다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002540.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002545.png]]

비밀번호를 보고 이름을 유추해서 해당 계정 SSH 접속에 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002549.png]]

`.ssh` 폴더에 jdoe의 개인키가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002557.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002601.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002606.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002617.png]]

로컬로 키를 가져와서 적당한 권한을 주고 `jdoe` 계정으로 접속 시도, 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002621.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002625.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002633.png]]

`showmount`로 공유 폴더 확인이 되지 않아서 공유 폴더 경로를 공백으로 하고 마운트 해보니 `/home/jdoe` 가 마운트 됐다. 권한이 없어 접근이 불가하다.

권한이 있는 `jdoe`의 계정이 있는데 왜 굳이 `jdoe`를 칼리와 연결하게 만들었을까?
\=> 공유 폴더로 `root bash`를 복사하여 `jdoe`의 계정으로 내 로컬 칼리의 `root bash`를 실행하게 해서 `root` 권한 상승이 가능하다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002637.png]]

접근하는 모든 서버에 연결 가능 (`*`), 읽기 쓰기(`rw`) 허용, 마운트 클라이언트의 root 요청을 일반 사용자 권한으로 낮추지 않음 (`no_root_squash`) 확인

![[00. Setting/00. 첨부파일/Pasted image 20261109002641.png]]

읽기 전용으로 연결한 마운트 (`ro`)를 해제하고 읽고 쓰기가 가능하게 (`rw`) 다시 마운트 해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002645.png]]

다시 마운트가 됐다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002648.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002652.png]]

`kali`의 `bash`를 공유 폴더에 옮기고 `root`로 실행되게 권한을 준 후 `jdoe`의 계정에서 실행을 해보니 오류가 뜬다. -> 버전 호환이 안 된다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002655.png]]

`jdoe`의 `bash`를 로컬 `kali`로 가져온다.

![[00. Setting/00. 첨부파일/Pasted image 20261109002659.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109002702.png]]

복사해온 `bash`로 다시 과정을 반복해주면 `rootbash`로 권한 상승이 가능하다.

## 6. 취약점

```
CVSS v4.0 점수: 10 / Critical
Macro vector: 000100
Exploitability: High
Complexity: High
Vulnerable system: High
Subsequent system: Medium
Exploitation: High
Security requirements: High
```

### 6.1 웹 페이지에 비밀번호 노출

  **6.1.1 설명**

- 웹페이지에 업로드 된 이미지에 mlores의 비밀번호가 노출되어 있었다.
- mlores의 계정에 원격으로 접속할 수 있었다.

  **6.1.2 조치방법**

- 웹페이지에 업로드하는 매체, 글 등은 엄격하게 검수해야 한다. 해당 이미지는 삭제한다.

### 6.2 NFS의 '\*(rw, no\_root\_squash)' 설정

  **6.2.1 설명**

- 공유 폴더 소유자인 `jdoe` 계정의 `/etc/exports` 를 확인했을 때 `*(rw,no_root_squash)`로 설정이 되어 있었다.
- 모든 사용자가 접근이 가능하고, 공유 폴더에 접근한 사용자에게 읽고 쓰기 권한을 줄 수 있고, 루트로 실행하려는 요청을 그대로 실행한다.

  **6.2.2 조치방법**

- `*`를 신뢰할 수 있는 주소로 제한한다.
- 굳이 쓰기가 필요 없다면 `rw` -> `ro`로 변경한다.
- `no_root_squash`를 `root_squash`로 바꾼다.
