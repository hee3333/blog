---
publish: true
title: 모의해킹 보고서 - lab05
description: WPScan으로 wpdiscuz 플러그인을 찾아내고 취약점 버전을 확인 후 취약점을 이용하여 웹쉘, 리버스쉘 올리기. crontab 예약 작업 확인 후 필요한 계정 정보 찾기.  /opt 에서 크리덴셜 파일 찾아서 디코딩, su change. crontab 작업 내용 따라 root의 권한으로 실행되도록 내 로컬 root의 bin/bash를 복사, root.sh 파일을 만들어 실행하도록 하면 root로 권한 상승 성공
created: 2026-10-20
modified: 2026-11-08T15:11:44.830Z
published: 2026-10-20
tags:
  - Linux
  - Wordpress
  - WPScan
  - wpDiscuz
  - webshell
  - reverseshell
  - crontab
  - rootbash
  - root_sh
  - rot47
  - base64
  - gobuster
  - nmap
  - searchsploit
date: 2026-10-20
lab: lab05
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 10월 20일에 진행된 lab05에 대한 모의 해킹 보고서이다.

## 2. 총평

이번 lab05 모의해킹에서는 취약점이 있는 wpdiscuz 7.0.4 버전 사용, /opt 폴더에 사용자 크리덴셜 노출, 불필요한 cron 작업 잔재로 연계되는 취약점으로 인해 root 권한 탈취가 가능했다. 이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 wpdiscuz 최신 버전 패치를 권고하고 크리덴셜 파일 열람 최소 권한이 필요하며 불필요한 cron 작업을 삭제해야 한다.

## 3. 정보 수집 대상

개인 실습 서버 lab05을 대상으로 취약점을 점검했다. 대상 서버 lab05의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점'섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명 | 대응방안 |
| :--- | :---: | :--- | :--- |
| 취약점이 있는 wpdiscuz 7.0.4 버전 사용 | 최상 | 웹쉘을 만들어 올릴 수 있고 웹쉘로 리버스쉘을 올려 원격 접속이 가능 | wpdiscuz 최신 패치 권고 |
| /opt 폴더에 사용자 크리덴셜 노출 | 최상 | 암호화가 되어 있었으나 디코딩이 가능하였고 비밀번호 획득 | 파일 열람 최소 권한 권고 |
| 불필요한 cron 작업 잔재 | 최상 | 크리덴셜 파일로 접속 가능한 사용자 권한의 폴더에서 root 자격으로 실행되는 cron 작업 잔재 | 불필요한 cron 작업을 삭제 |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261108235522.png]]

포트 스캔을 해보니 22, 80포트가 열려있다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235529.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261108235536.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261108235541.png]]

gobuster를 해보니 블로그가 나왔다. wordpress로 만들어진 페이지다. 왜 로드가 제대로 안 되는가? -> 호스트 등록을 해야한다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235550.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261108235558.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261108235603.png]]

사이트가 정상적으로 로딩된다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235610.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261108235617.png]]

wpscan으로 스캔해보면 wpdiscuz 플러그인이 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235623.png]]

7.0.4 버전을 확인했다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235630.png]]

7.0.4에 대한 취약점을 찾았다. 댓글로 파일을 업로드할 때의 원격 접속이 가능한 취약점. 이미지만 업로드가 가능하다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235653.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261108235659.png]]

주소를 확인해서 코드를 실행하니 웹쉘이 업로드됐다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235708.png]]

웹쉘 주소를 들어가보니 GIF689a; -> php지만 GIF인 척 들어갔다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235714.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261108235719.png]]

443포트를 열어놓고 버프 스위트에 웹쉘에 리버스쉘을 올리고 연결하면 www-data 권한으로 원격 접속이 가능하다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235729.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261108235735.png]]

UID 목록을 확인한다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235740.png]]

crontab을 확인하면 매분 실행되는 backup.sh이 있다. /home/james의 파일을 gzip으로 압축하고 tar로 묶는 실행파일. james 파일은 james의 권한이 필요하다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235745.png]]

/opt 폴더에서 .creds 파일을 발견했다. 암호가 들어있다.

rot47를 적용해 base64 문자가 되는지 확인. 디코딩을 4번 하면

`james:S3cr37_P@$$W0rd`
이 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261108235753.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261108235758.png]]

james로 su 변환 후 root의 /bin/bash를 복사해서 만든 bash 실행 파일 `root.sh`를 만들어서 cron 예약 작업이 root로 실행하도록 만든다. 실행하면 유효 사용자 ID를 파일 소유자인 root로 설정한다.

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

### 6.1 취약점이 있는 wpdiscuz 7.0.4 버전 사용

  **6.1.1 설명**

- 원격 접속 취약점이 있는 wpdiscuz 7.0.4 버전을 사용하고 있었다.
- 웹쉘을 만들어 올릴 수 있고 웹쉘로 리버스쉘을 올려 원격 접속이 가능하다.

  **6.1.2 조치방법**

- wpdiscuz 최신 패치 권고.

### 6.2 /opt 폴더에 사용자 크리덴셜 노출

  **6.2.1 설명**

- 일반 사용자 계정이 /opt 폴더에 .creds로 저장되어 있었다.
- 암호화가 되어 있었으나 디코딩이 가능하였고 비밀번호를 획득할 수 있었다.

  **6.2.2 조치방법**

- 파일 열람 최소 권한 권고

### 6.3 불필요한 cron 작업 잔재

  **6.3.1 설명**

- 크리덴셜 파일로 접속 가능한 사용자 권한의 폴더에서 root 자격으로 실행되는 cron 작업이 있었다.
- root의 자격으로 실행되기 때문에 cron 작업에 sh 명령으로 /bin/bash를 복사하라 하면 root의 /bin/bash를 복사하게 되고, root 권한으로 파일을 만들고 권한을 부여하기 때문에 유효 사용자는 root가 되고 root의 bash를 실행하면서 root 권한 탈취가 가능하다.

  **6.3.2 조치방법**

- 불필요한 cron 작업을 삭제한다.
