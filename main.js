/** 📌[텍스트 및 시간 변경] */
class CountDown {
    /** 텍스트 및 시간 변경 */
    constructor() {
        this.currDate = new Date();
        this.nextYear = new Date(`${this.currDate.getFullYear() + 1}-01-01, 00:00:00`);
        /** this.nextYear = new Date('2024-12-09T00:00:00'); */
        this.nextTime = this.nextYear.getTime();
        this.IDS = ["day", "hour", "min", "sec"];
 
        this.SVG = new SvgAnimation(this);
    }//constructor
 
    /** 실행 */
    init() {
        console.log('new Date("yyyy-mm-dd, 00:00:00").getTime()', "-", "Date.now()");
        this.add_dom();
        this.SVG.set_svg_total_length();
        this.set_new_year_text();
        this.count_down();
    }//init
 
    /** DOM 삽입 */
    add_dom() {
        const $temp = document.getElementById('temp-circle');
        const $wrap = document.getElementById('wrap-time');
 
        for (let i = 0; i < this.IDS.length; i++) {
            const $clone = document.importNode($temp.content, true);
            const $circle = $clone.querySelector('.circle-wrap');
            $circle.id = `circle-wrap-${this.IDS[i]}`;
            $circle.style.setProperty('--clr', this.SVG.COLORS[i]);
            const $time = $clone.querySelector('.circle-time');
            $time.innerHTML = `<span id="circle-time-${this.IDS[i]}">00</span><br>${this.IDS[i]}`
            $wrap.appendChild($clone);
        }
    }//add_dom
 
    /** 하단의 Happy NewYear 문구에 내년 연도를 설정한다 */
    set_new_year_text() {
        const $newyear = document.getElementById('newyear');
        $newyear.textContent = this.nextYear.getFullYear();
    }//set_new_year_text
 
    /** 카운트 다운 계산 */
    count_down() {
        const GAP = this.nextTime - Date.now();
        const [msec, sec, min, hour] = [1000, 60, 60, 24];
        const cday = msec * sec * min * hour;
        const chour = msec * sec * min;
        const cmin = msec * sec;
 
        const DD = Math.floor(GAP / cday);
        const HH = Math.floor((GAP % cday) / chour);
        const MM = Math.floor((GAP % chour) / cmin);
        const SEC = Math.floor((GAP % cmin) / msec);
 
        const timeInfo = [DD, HH, MM, SEC];
        this.change_time_text(timeInfo);
        this.SVG.animate_stroke(timeInfo);
        this.SVG.animate_dots(timeInfo);
 
        setTimeout(() => { this.count_down() }, 1000);
    }//count_down
 
    /** 
     * 카운트 다운 시간 텍스트 변경 
     * @param {Array}timeInfo [DD,HH,MM,SEC]
     * */
    change_time_text(timeInfo) {
        this.IDS.forEach((ID, idx) => {
            const $time = document.getElementById(`circle-time-${ID}`);
            $time.textContent = String(timeInfo[idx]).padStart(2, "0");
        })
    }//change_time_text
}//class-CountDown
 
/** 📌[svg 애니메이션 관련] */
class SvgAnimation {
    /** svg 애니메이션 관련 
     * @param {Class}CNTD CountDown class 받아옴
    */
    constructor(CNTD) {
        this.CNTD = CNTD;
        this.COLORS = ["#ffffff", "#ff2972", "#fee800", "#4fcc43"];
        this.svgTotalLength = null;
    }//constructor
 
    /** svg circle의 stroke-dasharray를 설정하기 위해 totalLength 값을 가져온다 */
    set_svg_total_length() {
        const $$svg = document.getElementsByTagName('svg');
        this.totalLength = Math.ceil(document.getElementsByTagName('circle')[0].getTotalLength());
        console.log('svg.getTotalLength() : ', this.totalLength);
 
        for (let $svg of $$svg) {
            const $circle = $svg.getElementsByTagName('circle')[1];
            $circle.style.strokeDasharray = this.totalLength;
            $circle.style.strokeDashoffset = this.totalLength;
        }//for
    }//set_svg_total_length
 
    /** 
     * 스트로크 애니메이션 
     * @param {Array}timeInfo [DD,HH,MM,SEC]
    */
    animate_stroke(timeInfo) {
        const [DD, HH, MM, SEC] = timeInfo;
        const [$day, $hour, $min, $sec] = Array
            .from(document.getElementsByTagName('svg'))
            .map($svg => $svg.getElementsByTagName('circle')[1]);
        $day.style.strokeDashoffset = this.totalLength - (this.totalLength * DD) / 365;
        $hour.style.strokeDashoffset = this.totalLength - (this.totalLength * HH) / 24;
        $min.style.strokeDashoffset = this.totalLength - (this.totalLength * MM) / 60;
        $sec.style.strokeDashoffset = this.totalLength - (this.totalLength * SEC) / 60;
    }//animate_stroke
 
    /** 
     * 점 움직이기 
     * @param {Array}timeInfo [DD,HH,MM,SEC]
     * */
    animate_dots(timeInfo){
        const [DD,HH,MM,SEC] = timeInfo;
        const [$day,$hour,$min,$sec] = Array.from(document.getElementsByClassName('circle-dot'))
        $day.style.transform = `rotate(${DD / 365 * 360}deg)`;
        $hour.style.transform = `rotate(${HH / 24 * 360}deg)`;
        $min.style.transform = `rotate(${MM / 60 * 360}deg)`;
        $sec.style.transform = `rotate(${SEC / 60 * 360}deg)`;
    }//animate_dots
}//SvgAnimation
 
/* 📌[실행] */
new CountDown().init();
