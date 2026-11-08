---
publish: true
title: 모의해킹 보고서 - lab13
created: 2026-11-06
modified: 2026-11-08T15:52:50.819Z
published: 2026-11-06
date: 2026-11-06
tags:
description:
lab: lab13
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 6일에 진행된 lab13에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab13 모의해킹에서는 MS17-010 취약점을 이용한 공격으로 NT AUTHORITY\SYSTEM 권한 탈취까지 이어졌다. 이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 취약점이 패치된 Windows 버전으로 업데이트를 해야한다.

## 3. 정보 수집 대상

개인 실습 서버 lab13을 대상으로 취약점을 점검했다. 대상 서버 lab13의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명 | 대응방안 |
| :--- | :---: | :--- | :--- |
| 취약점이 노출된 Windows 버전 사용 | 최상 | MS17-010 취약점으로 권한 탈취가 가능했다 | 버전 업데이트 권고 |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261109005044.png]]

포트 스캔으로 `SMB`가 있다는 걸 알았다. `SMB`와 관련된 `Windows 7`의 취약점을 찾으니 `MS17-010`이 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005048.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109005052.png]]

`Metasploit`으로 취약점 공격을 해보자

![[00. Setting/00. 첨부파일/Pasted image 20261109005057.png]]

`NT AUTHORITY\SYSTEM` 권한 탈취를 성공했다

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

### 6.1 취약점이 노출된 Windows 버전 사용

  **6.1.1 설명**

- MS17-010 취약점으로 권한 탈취가 가능했다.

  **6.1.2 조치방법**

- Windows 버전 업데이트 권고.
