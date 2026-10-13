import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Notice | persona",
  description: "A plain-language privacy notice for the persona personality-insight demo.",
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page section-wrap">
      <a className="brand" href="/psycho/"><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a>
      <div className="eyebrow"><span className="eyebrow-line" />PRIVACY · CARE · CLARITY</div>
      <h1>隐私说明 <span>/ Privacy Notice</span></h1>
      <p className="privacy-updated">演示版说明 · Demo notice · Last updated: 13 October 2026</p>
      <p>这是一份面向当前 persona 演示版的简明说明，不构成法律意见，也不代表已完成任何特定法律合规认证。</p>
      <p>This plain-language notice describes the current persona demo. It is not legal advice and does not represent certification of compliance with any particular law.</p>

      <h2>1. 浏览器本地保存 / Local browser storage</h2>
      <p>答题进度与反思笔记可能保存在你正在使用的浏览器本地，以便继续测评或查看记录。使用共享设备时，请在结束后清除本地进度与笔记。清除浏览器数据也可能删除这些内容。</p>
      <p>Assessment progress and reflection notes may be stored locally in your browser so you can resume the assessment or revisit your notes. On a shared device, clear local progress and notes when finished. Clearing browser data may also remove them.</p>

      <h2>2. 可选 Google Sheets 保存 / Optional Google Sheets save</h2>
      <p>网站统一配置了 Google Apps Script Web App 接口。只有在结果页勾选同意并主动点击保存后，网站才会尝试提交演示记录。记录包括随机记录编号、时间、语言、架构版本、五项演示维度分数及同意标记。</p>
      <p>The site operator configures the Google Apps Script Web App endpoint centrally. Only after you check the consent box on the results page and click save will the site attempt to submit a demo record. The record contains a random record ID, timestamp, language, schema version, five illustrative dimension scores, and a consent flag.</p>
      <p>此流程不会提交原始问卷答案、反思笔记、姓名、邮箱或电话号码。你配置的 Apps Script 与 Google Sheet 由你或其管理者控制；请确保表格访问权限设置恰当，不要把该演示端点用于敏感或可识别个人身份的数据。</p>
      <p>This flow does not submit raw questionnaire answers, reflection notes, your name, email, or phone number. The Apps Script and Google Sheet you configure are controlled by you or their administrator. Set sheet permissions carefully and do not use this demo endpoint for sensitive or directly identifying data.</p>
      <p>浏览器的跨域限制意味着网页可能无法读取服务器响应。显示请求已发送并不保证记录已写入；请到 Google Sheet 检查新增记录。</p>
      <p>Browser cross-origin restrictions may prevent the page from reading the server response. A sent-request message does not guarantee a row was stored; verify it in your Google Sheet.</p>

      <h2>3. 提取码与报告找回 / Retrieval codes and report recovery</h2>
      <p>保存演示结果时，网站会显示一个提取码。请自行保存该代码；任何持有有效提取码的人都可能查看对应的演示分数。当前演示版的提取码用于找回五项汇总分数，不会恢复逐题答案或本地反思笔记。由于浏览器跨域限制，保存请求发出不代表记录一定成功写入，请先验证提取码可以找回结果。</p>
      <p>When you save a demo result, the site displays a retrieval code. Keep it private: anyone with a valid code may be able to view the associated demo scores. The demo code retrieves the five summary scores only; it does not restore individual answers or local reflection notes. Because of browser cross-origin restrictions, a sent save request does not guarantee storage succeeded, so test retrieval first.</p>

      <h2>4. 演示分数的用途 / Purpose of demo scores</h2>
      <p>当前问卷与分数仅用于演示产品流程，尚未经过正式信度、效度或人群常模验证。它们不应用于诊断、招聘、升学、关系判断或其他重大决定。</p>
      <p>The current questionnaire and scores are for demonstrating the product flow only. They have not undergone formal reliability, validity, or population-norm validation and should not be used for diagnosis, hiring, education, relationship judgments, or other consequential decisions.</p>

      <h2>5. 保留与删除 / Retention and deletion</h2>
      <p>本地内容可通过应用提供的清除操作或浏览器设置删除。Google Sheets 中的记录需要由表格管理者手动删除，或按其配置的保留清理流程删除。当前 Apps Script 提供可选的 90 天清理函数，但该功能需要管理者自行启用，并非自动默认开启。</p>
      <p>Local content can be removed using the app's clear controls or browser settings. Records in Google Sheets must be deleted by the sheet administrator or through a retention process they configure. The current Apps Script includes an optional 90-day cleanup function, but an administrator must enable it; it is not enabled by default.</p>

      <h2>6. 联系与版本范围 / Contact and scope</h2>
      <p>这是 MVP 演示版隐私说明。若将产品用于商业或公开运营，请在上线前补充真实的运营主体、联系渠道、数据处理依据、用户权利流程和适用地区要求，并进行相应的隐私与安全审查。</p>
      <p>This is an MVP demo notice. Before commercial or public operation, add the real operator identity and contact details, processing basis, user-rights process, and applicable regional requirements, and conduct an appropriate privacy and security review.</p>
      <a className="button-primary privacy-back" href="/psycho/">返回首页 / Back to home <span>↗</span></a>
    </main>
  );
}
