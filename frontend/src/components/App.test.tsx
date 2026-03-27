import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

function buildCsv(account: string, title: string, publishDate = '2026-03-26') {
  return [
    'platform,account,title,publishDate,contentType,followers,followerDelta,views,likes,favorites,comments,shares',
    `xiaohongshu,${account},${title},${publishDate},note,1000,20,5000,120,35,12,8`,
  ].join('\n');
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('渲染中文驾驶舱标题与总览文案', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /小红书与视频号运营驾驶舱/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/跨平台增长、曝光与账号诊断总览/i)).toBeInTheDocument();
    expect(screen.getByText(/^运营驾驶舱/i)).toBeInTheDocument();
    expect(
      screen.getByText(/当前筛选范围内以曝光规模为主视角，重点观察涨粉变化与互动效率/i),
    ).toBeInTheDocument();
  });

  it('导入缺少字段时显示校验提示', async () => {
    const user = userEvent.setup();
    render(<App />);

    const file = new File(['platform,account\nxiaohongshu,Test'], 'bad.csv', {
      type: 'text/csv',
    });

    await user.upload(screen.getByLabelText(/上传 excel 或 csv/i), file);

    expect(await screen.findByText(/missing required column/i)).toBeInTheDocument();
  });

  it('按平台筛选时保留对应工作台内容', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/^平台$/i), 'wechat-channel');

    const table = screen.getByRole('table');
    expect(within(table).getByText(/City Frames/i)).toBeInTheDocument();
    expect(screen.queryByText(/Travel Lab/i)).not.toBeInTheDocument();
  });

  it('筛选结果为空时显示中文空状态', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/^时间范围$/i), '7d');

    expect(screen.getByText(/当前筛选条件下暂无数据/i)).toBeInTheDocument();
  });

  it('渲染中文分析区与工作台区块标题', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /平台信号/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /账号观察列表/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /内容工作台/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /优先预警/i })).toBeInTheDocument();
  });

  it('支持一次选择多个文件并合并到同一看板', async () => {
    const user = userEvent.setup();
    render(<App />);

    const files = [
      new File([buildCsv('Batch Alpha', 'Alpha 标题')], 'alpha.csv', { type: 'text/csv' }),
      new File([buildCsv('Batch Beta', 'Beta 标题')], 'beta.csv', { type: 'text/csv' }),
    ];

    await user.upload(screen.getByLabelText(/上传 excel 或 csv/i), files);

    expect(await screen.findByText(/已导入文件 2/i)).toBeInTheDocument();
    expect(screen.getByText(/累计记录 4/i)).toBeInTheDocument();
    expect(screen.getByText(/alpha\.csv、beta\.csv/i)).toBeInTheDocument();
  });

  it('支持后续继续追加导入而不是覆盖当前数据', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.upload(
      screen.getByLabelText(/上传 excel 或 csv/i),
      new File([buildCsv('Append One', '第一次导入')], 'append-one.csv', { type: 'text/csv' }),
    );
    await user.upload(
      screen.getByLabelText(/上传 excel 或 csv/i),
      new File([buildCsv('Append Two', '第二次导入')], 'append-two.csv', { type: 'text/csv' }),
    );

    expect(await screen.findByText(/已导入文件 2/i)).toBeInTheDocument();
    expect(screen.getByText(/累计记录 4/i)).toBeInTheDocument();
    expect(screen.getByText(/append-one\.csv、append-two\.csv/i)).toBeInTheDocument();
  });

  it('清空导入数据后回到初始演示看板', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.upload(
      screen.getByLabelText(/上传 excel 或 csv/i),
      new File([buildCsv('Reset Account', '待清空数据')], 'reset.csv', { type: 'text/csv' }),
    );

    expect(await screen.findByText(/已导入文件 1/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /清空数据/i }));

    expect(screen.getByText(/已导入文件 0/i)).toBeInTheDocument();
    expect(screen.getByText(/累计记录 2/i)).toBeInTheDocument();
    expect(screen.getByText(/当前使用初始演示数据/i)).toBeInTheDocument();
  });

  it('手动触发后展示 ai 分析结果', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          summary: '整体表现稳定。',
          platformInsights: ['小红书涨粉更强。'],
          risks: ['视频号互动偏弱。'],
          actions: ['优先优化视频号结尾引导。'],
        }),
      }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /开始分析/i }));

    expect(await screen.findByText(/整体表现稳定/i)).toBeInTheDocument();
  });
});
